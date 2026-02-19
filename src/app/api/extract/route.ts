import { NextRequest, NextResponse } from "next/server";

const RECEIPT_SCHEMA = `{
  "id": "string",
  "name": "string",
  "settings": {
    "currency": "$",
    "font": "monospace",
    "paperWidth": "80mm",
    "watermark": true
  },
  "sections": [
    {
      "type": "header",
      "alignment": "center",
      "logoUrl": null,
      "businessName": "STORE NAME",
      "address": "Address line 1\\nCity, State ZIP\\nPhone",
      "divider": { "enabled": true, "style": "dashed" }
    },
    {
      "type": "store_info",
      "rows": [{ "key": "Label", "value": "Value" }],
      "divider": { "enabled": true, "style": "dashed" }
    },
    {
      "type": "items_list",
      "items": [{ "name": "Item Name", "price": "0.00", "isSubItem": false }],
      "divider": { "enabled": true, "style": "blank" }
    },
    {
      "type": "payment",
      "customLines": [
        { "title": "Subtotal", "value": "0.00" },
        { "title": "Tax", "value": "0.00" },
        { "title": "TOTAL", "value": "0.00", "bold": true }
      ],
      "divider": { "enabled": true, "style": "blank" }
    },
    {
      "type": "custom_message",
      "alignment": "center",
      "message": "Thank you!",
      "divider": { "enabled": false, "style": "blank" }
    }
  ]
}`;

const SYSTEM_PROMPT = `You are a receipt data extractor. The user will send you a receipt image. Extract ALL visible data and return a JSON object matching this exact schema:

${RECEIPT_SCHEMA}

Rules:
- Return ONLY valid JSON. No markdown fences, no explanation, no preamble.
- Preserve exact text from the receipt including original capitalization.
- Use \\n for line breaks inside address and message strings.
- Identify each section type correctly based on its content and position.
- Set logoUrl to null (cannot extract image URLs from photos).
- If a field is not visible or not applicable, omit it or use a sensible default.
- For the "id" field, use a lowercase slug based on the business name.
- For the "name" field, use the format "Business Name Receipt".
- Include ALL items visible on the receipt in items_list.
- Include payment method details, change, tips, etc. in the payment section customLines.
- Include any footer messages (thank you, survey URLs, return policy) in a custom_message section.
- Every price value should be a string number like "6.70", not including the currency symbol.`;

export async function POST(request: NextRequest) {
  try {
    const { image, mediaType } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
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
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType || "image/jpeg"};base64,${image}`,
                },
              },
              {
                type: "text",
                text: "Extract this receipt.",
              },
            ],
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

    // Parse and validate JSON
    let rawText = content.trim();
    // Strip markdown fences if present
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const receiptData = JSON.parse(rawText);
    return NextResponse.json({ receipt: receiptData });
  } catch (error) {
    console.error("Extract error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to extract receipt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
