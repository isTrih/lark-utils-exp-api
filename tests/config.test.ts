import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getConfigPath, loadConfig, normalizeApiBaseUrl, redactToken, saveConfig } from "../src/config.ts";

describe("config location", () => {
  test("uses macOS Application Support", () => {
    expect(getConfigPath({ platform: "darwin", home: "/Users/test", env: {} })).toBe(
      "/Users/test/Library/Application Support/kp-cli/config.json",
    );
  });

  test("uses Windows APPDATA", () => {
    expect(getConfigPath({ platform: "win32", home: "C:\\Users\\test", env: { APPDATA: "C:\\Users\\test\\AppData\\Roaming" } })).toBe(
      "C:\\Users\\test\\AppData\\Roaming\\kp-cli\\config.json",
    );
  });
});

describe("config storage", () => {
  test("round trips without changing the token", async () => {
    const directory = await mkdtemp(join(tmpdir(), "kp-cli-test-"));
    const path = join(directory, "nested", "config.json");
    await saveConfig(
      {
        version: 1,
        apiBaseUrl: "https://autoxingtu.api.ali.trih.top/",
        mutationApiToken: "token-1234567890",
      },
      path,
    );
    expect(await loadConfig(path)).toEqual({
      version: 1,
      apiBaseUrl: "https://autoxingtu.api.ali.trih.top",
      mutationApiToken: "token-1234567890",
    });
    expect(JSON.parse(await readFile(path, "utf8")).mutationApiToken).toBe("token-1234567890");
    if (process.platform !== "win32") expect((await stat(path)).mode & 0o777).toBe(0o600);
  });
});

test("normalizes API URLs and redacts tokens", () => {
  expect(normalizeApiBaseUrl("https://example.com///")).toBe("https://example.com");
  expect(() => normalizeApiBaseUrl("http://example.com")).toThrow();
  expect(redactToken("abcdefghijklmnop")).toBe("abcd…mnop");
});
