import { NextRequest, NextResponse } from "next/server";
import { RECEIPT_SYSTEM_PROMPT, GENERATE_SUFFIX } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 8192,
        messages: [
          {
            role: "system",
            content: RECEIPT_SYSTEM_PROMPT + GENERATE_SUFFIX,
          },
          {
            role: "user",
            content: `Generate a receipt template from this description:\n\n"${description.trim()}"`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", err);
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    let rawText = content.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const receipt = JSON.parse(rawText);
    return NextResponse.json({ receipt });
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate receipt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
