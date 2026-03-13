import { describe, it, expect } from "vitest";
import { normalizeMediaType } from "../mediaType";

describe("normalizeMediaType", () => {
  it("normalizes image/jpg to image/jpeg", () => {
    expect(normalizeMediaType("image/jpg")).toBe("image/jpeg");
  });

  it("passes through image/jpeg as-is", () => {
    expect(normalizeMediaType("image/jpeg")).toBe("image/jpeg");
  });

  it("passes through image/png", () => {
    expect(normalizeMediaType("image/png")).toBe("image/png");
  });

  it("passes through image/gif", () => {
    expect(normalizeMediaType("image/gif")).toBe("image/gif");
  });

  it("passes through image/webp", () => {
    expect(normalizeMediaType("image/webp")).toBe("image/webp");
  });

  it("returns null for unsupported types", () => {
    expect(normalizeMediaType("image/bmp")).toBeNull();
    expect(normalizeMediaType("application/pdf")).toBeNull();
    expect(normalizeMediaType("text/plain")).toBeNull();
    expect(normalizeMediaType("")).toBeNull();
  });
});
