import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

let app: ReturnType<typeof import("../src/app").createApp>;

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? "postgresql://test:test@localhost:5432/posco_test";
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";

  const module = await import("../src/app");
  app = module.createApp();
});

describe("backend smoke routes", () => {
  it("returns ok from the root route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "posco-backend", status: "ok" });
  });

  it("returns ok from the health route", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.time).toEqual(expect.any(String));
  });
});