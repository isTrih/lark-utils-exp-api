import { expect, test } from "bun:test";
import { generateApiCatalog } from "../src/openapi.ts";

test("generates a catalog with auth and connector endpoints", () => {
  const catalog = generateApiCatalog({
    openapi: "3.1.0",
    info: { version: "1.0.0" },
    paths: {
      "/api/v1/admin/projects": {
        get: {
          operationId: "listProjects",
          summary: "项目列表",
          tags: ["admin"],
          responses: { 200: { description: "OK" } },
        },
      },
      "/api/v1/queries/projects": {
        get: {
          operationId: "queryProjects",
          summary: "查询项目",
          tags: ["queries"],
          responses: { 200: { description: "OK" } },
        },
      },
    },
  });
  expect(catalog).toContain("GET /api/v1/admin/projects");
  expect(catalog).toContain("鉴权：MUTATION_API_TOKEN");
  expect(catalog).toContain("POST | `/api/data-sync/records`");
  expect(catalog).toContain("操作数量：`2`");
});
