import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../generate/route";
import { NextRequest } from "next/server";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/generate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    mockFetch.mockReset();
  });

  it("returns 400 when description is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Description is required");
  });

  it("returns 400 when description is empty string", async () => {
    const res = await POST(makeRequest({ description: "   " }));
    expect(res.status).toBe(400);
  });

  it("returns 500 when API key is not configured", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const res = await POST(makeRequest({ description: "a coffee receipt" }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toContain("OPENROUTER_API_KEY");
  });

  it("strips markdown fences from AI response", async () => {
    const receipt = { id: "test", name: "Test", settings: {}, sections: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "```json\n" + JSON.stringify(receipt) + "\n```",
            },
          },
        ],
      }),
    });

    const res = await POST(makeRequest({ description: "a test receipt" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.receipt.id).toBe("test");
  });

  it("parses clean JSON response", async () => {
    const receipt = { id: "cafe", name: "Cafe", settings: {}, sections: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify(receipt) } }],
      }),
    });

    const res = await POST(makeRequest({ description: "cafe receipt" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.receipt.id).toBe("cafe");
  });

  it("returns 500 on OpenRouter API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => "rate limited",
    });

    const res = await POST(makeRequest({ description: "a receipt" }));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toContain("429");
  });
});
