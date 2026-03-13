/**
 * Test script for receipt extraction API.
 *
 * Usage:
 *   npx tsx scripts/test-extract.ts <path-to-receipt-image>
 *
 * Example:
 *   npx tsx scripts/test-extract.ts ~/Downloads/canada-goose-receipt.png
 *
 * The script:
 * 1. Reads the image file and base64-encodes it
 * 2. Sends it to the local /api/extract endpoint
 * 3. Validates the response JSON structure
 * 4. Prints a summary of what was extracted
 */

import fs from "fs";
import path from "path";

const API_URL = process.env.API_URL || "http://localhost:3000/api/extract";

interface ValidationResult {
  pass: boolean;
  message: string;
}

function validate(receipt: Record<string, unknown>): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Top-level fields
  results.push({
    pass: typeof receipt.id === "string" && receipt.id.length > 0,
    message: `id: "${receipt.id}"`,
  });
  results.push({
    pass: typeof receipt.name === "string" && receipt.name.length > 0,
    message: `name: "${receipt.name}"`,
  });

  // Settings
  const settings = receipt.settings as Record<string, unknown> | undefined;
  results.push({
    pass: !!settings && typeof settings.currency === "string",
    message: `settings.currency: "${settings?.currency}"`,
  });
  results.push({
    pass: !!settings && typeof settings.font === "string",
    message: `settings.font: "${settings?.font}"`,
  });
  results.push({
    pass: !!settings && typeof settings.fontSize === "string",
    message: `settings.fontSize: "${settings?.fontSize}"`,
  });
  results.push({
    pass: !!settings && typeof settings.pdfSize === "string",
    message: `settings.pdfSize: "${settings?.pdfSize}"`,
  });

  // Sections
  const sections = receipt.sections as Array<Record<string, unknown>> | undefined;
  results.push({
    pass: Array.isArray(sections) && sections.length > 0,
    message: `sections count: ${sections?.length ?? 0}`,
  });

  if (Array.isArray(sections)) {
    const sectionTypes = sections.map((s) => s.type);
    results.push({
      pass: sectionTypes.includes("header") || sectionTypes.includes("logo") || sectionTypes.includes("business_info"),
      message: `has header/logo/business_info: ${sectionTypes.includes("header") || sectionTypes.includes("logo") || sectionTypes.includes("business_info")}`,
    });
    results.push({
      pass: sectionTypes.includes("store_info"),
      message: `has store_info: ${sectionTypes.includes("store_info")}`,
    });
    results.push({
      pass: sectionTypes.includes("items_list"),
      message: `has items_list: ${sectionTypes.includes("items_list")}`,
    });

    // Check items_list has items
    const itemsList = sections.find((s) => s.type === "items_list") as Record<string, unknown> | undefined;
    if (itemsList) {
      const items = itemsList.items as Array<Record<string, unknown>> | undefined;
      results.push({
        pass: Array.isArray(items) && items.length > 0,
        message: `items_list items count: ${items?.length ?? 0}`,
      });
    }

    // Check for payment or totals (totals can be in payment, three_column, items_list.showTotals, or store_info)
    const hasPayment = sectionTypes.includes("payment");
    const hasThreeCol = sectionTypes.includes("three_column");
    const itemsListWithTotals = sections.find(
      (s) => s.type === "items_list" && (s as Record<string, unknown>).showTotals
    );
    const storeInfoWithTotals = sections.find((s) => {
      if (s.type !== "store_info") return false;
      const rows = (s as Record<string, unknown>).rows as Array<Record<string, unknown>> | undefined;
      return rows?.some((r) => {
        const key = ((r.key as string) || "").toLowerCase();
        return key.includes("total") || key.includes("tax") || key.includes("subtotal");
      });
    });
    results.push({
      pass: hasPayment || hasThreeCol || !!itemsListWithTotals || !!storeInfoWithTotals,
      message: `has payment/totals: payment=${hasPayment}, three_column=${hasThreeCol}, items_totals=${!!itemsListWithTotals}, store_info_totals=${!!storeInfoWithTotals}`,
    });

    // Check for barcode (Canada Goose receipt has one)
    results.push({
      pass: sectionTypes.includes("barcode"),
      message: `has barcode: ${sectionTypes.includes("barcode")}`,
    });

    // Print section summary
    console.log("\n--- Section Summary ---");
    for (const section of sections) {
      const id = section.id || "(no id)";
      const type = section.type;
      let detail = "";

      if (type === "header") {
        detail = `businessName="${(section as Record<string, unknown>).businessName}"`;
      } else if (type === "store_info") {
        const rows = (section as Record<string, unknown>).rows as Array<Record<string, unknown>> | undefined;
        detail = `${rows?.length ?? 0} rows`;
      } else if (type === "items_list") {
        const items = (section as Record<string, unknown>).items as Array<Record<string, unknown>> | undefined;
        detail = `${items?.length ?? 0} items, format="${(section as Record<string, unknown>).format}"`;
      } else if (type === "payment") {
        detail = `method="${(section as Record<string, unknown>).method}"`;
      } else if (type === "custom_message") {
        const msg = (section as Record<string, unknown>).message as string;
        detail = `"${msg?.substring(0, 50)}${msg?.length > 50 ? "..." : ""}"`;
      } else if (type === "barcode") {
        detail = `value="${(section as Record<string, unknown>).value}", format="${(section as Record<string, unknown>).format}"`;
      }

      console.log(`  [${type}] ${id}: ${detail}`);
    }
  }

  // Canada Goose specific checks
  const headerSection = (sections ?? []).find((s) => s.type === "header" || s.type === "business_info") as Record<string, unknown> | undefined;
  if (headerSection) {
    const name = ((headerSection.businessName as string) || "").toUpperCase();
    results.push({
      pass: name.includes("CANADA GOOSE"),
      message: `business name contains "Canada Goose": "${headerSection.businessName}"`,
    });
  }

  // Check currency is Euro
  results.push({
    pass: settings?.currency === "€",
    message: `currency is Euro: "${settings?.currency}"`,
  });

  return results;
}

async function main() {
  const imagePath = process.argv[2];
  if (!imagePath) {
    console.error("Usage: npx tsx scripts/test-extract.ts <path-to-receipt-image>");
    process.exit(1);
  }

  const resolvedPath = path.resolve(imagePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const mediaTypeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  const mediaType = mediaTypeMap[ext] || "image/jpeg";

  console.log(`Reading image: ${resolvedPath}`);
  const imageBuffer = fs.readFileSync(resolvedPath);
  const base64 = imageBuffer.toString("base64");
  console.log(`Image size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
  console.log(`Media type: ${mediaType}`);

  console.log(`\nSending to: ${API_URL}`);
  console.log("Waiting for AI extraction...\n");

  const startTime = Date.now();
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, mediaType }),
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Response received in ${elapsed}s (status: ${response.status})`);

  if (!response.ok) {
    const err = await response.text();
    console.error(`\nAPI Error: ${err}`);
    process.exit(1);
  }

  const data = await response.json();
  const receipt = data.receipt;

  if (!receipt) {
    console.error("\nNo receipt in response:", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  // Write raw output for inspection
  const outPath = path.join(path.dirname(resolvedPath), "canada-goose-extracted.json");
  fs.writeFileSync(outPath, JSON.stringify(receipt, null, 2));
  console.log(`\nRaw JSON saved to: ${outPath}`);

  // Run validations
  console.log("\n=== Validation Results ===\n");
  const results = validate(receipt);

  let passed = 0;
  let failed = 0;
  for (const r of results) {
    const icon = r.pass ? "PASS" : "FAIL";
    console.log(`  [${icon}] ${r.message}`);
    if (r.pass) passed++;
    else failed++;
  }

  console.log(`\n${passed} passed, ${failed} failed out of ${results.length} checks`);

  if (failed > 0) {
    process.exit(1);
  }

  console.log("\nAll checks passed!");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
