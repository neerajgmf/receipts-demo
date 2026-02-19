import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a receipt editor. The user will give you a current receipt JSON and a plain-English instruction describing what they want to change. Return the COMPLETE updated receipt JSON with all changes applied.

Rules:
- Return ONLY valid JSON. No markdown fences, no explanation, no preamble.
- Only modify what the user explicitly asks to change.
- Leave all other fields exactly as they are.
- If items or prices change, recalculate subtotal, tax, and total automatically.
- Maintain all existing section types and section order.
- Every price value should be a string number like "6.70", not including the currency symbol.
- Preserve the exact JSON structure — same keys, same nesting.`;

export async function POST(request: NextRequest) {
  try {
    const { receipt, instruction } = await request.json();

    if (!receipt || !instruction) {
      return NextResponse.json(
        { error: "Receipt JSON and instruction are required" },
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
        max_tokens: 4096,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Current receipt JSON:\n${JSON.stringify(receipt, null, 2)}\n\nInstruction: "${instruction}"`,
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

    const updatedReceipt = JSON.parse(rawText);
    return NextResponse.json({ receipt: updatedReceipt });
  } catch (error) {
    console.error("Edit error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to apply edit";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
