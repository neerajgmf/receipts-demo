"use client";

import { ReceiptRenderer } from "@/components/ReceiptRenderer";
import type { ReceiptJSON } from "@/types/receipt";

const testReceipt: ReceiptJSON = {
  id: "canada-goose-milan",
  name: "Canada Goose Milan Receipt",
  settings: {
    currency: "€",
    currencyFormat: "none",
    font: "merchantcopy",
    fontSize: "14px",
    textColor: "#000000",
    pdfSize: "80mm",
    showBackground: { enabled: true, style: "1" },
    watermark: true,
  },
  sections: [
    {
      type: "header",
      id: "header-cg",
      showLogo: true,
      logoUrl: null,
      logoWidth: 150,
      businessName: "CANADA GOOSE",
      businessNameSize: 16,
      alignment: "center",
      lineHeight: 1,
    },
    {
      type: "store_info",
      id: "storeinfo-cg",
      rows: [
        { key: "Store:", value: "Canada Goose Milan" },
        { key: "Address:", value: "Via della Spiga 18," },
        { key: "", value: "20121, Milano," },
        { key: "", value: "Italy" },
        { key: "Phone:", value: "4167895002" },
        { key: "Transaction:", value: "SOHO-SOHO-R08-32248" },
        { key: "", value: "Date: 2023-11-01" },
        { key: "Terminal:", value: "SOHO-R08" },
        { key: "", value: "Time: 10:28" },
        { key: "Employee:", value: "11970" },
        { key: "", value: "Yanilsa" },
        { key: "Customer No:", value: "" },
        { key: "Cust. Name:", value: "Alex Leandersson" },
        { key: "Comments:", value: "" },
        { key: "7120018", value: "" },
      ],
      keyAlignment: "left",
      valueAlignment: "right",
      lineHeight: 1.1,
      marginTop: 10,
    },
    {
      type: "items_list",
      id: "items-cg",
      format: "4col",
      showColumnHeaders: true,
      columnLabels: {
        name: "ITEM NAME",
        quantity: "QTY",
        unitPrice: "PRICE",
        price: "TOTAL",
      },
      headerBold: true,
      items: [
        { name: "", price: "", isDescription: true },
        {
          name: "Canada Goose MacMillan Parka Heritage",
          quantity: "1",
          unitPrice: "923,50€",
          price: "",
        },
      ],
      showTotals: false,
      lineHeight: 1.1,
      marginTop: 10,
      divider: { enabled: true, style: "solid" },
      bottomDivider: { enabled: true, style: "solid" },
    },
    {
      type: "store_info",
      id: "totals-cg",
      rows: [
        { key: "Unit Price:", value: "923,5€" },
        { key: "tax:", value: "201,5€" },
        { key: "Total:", value: "1,125.00€" },
      ],
      keyAlignment: "left",
      valueAlignment: "right",
      lineHeight: 1.1,
      marginTop: 5,
    },
    {
      type: "store_info",
      id: "payment-cg",
      rows: [{ key: "Card Number", value: "XXXXXXXXXXXX2393" }],
      keyAlignment: "left",
      valueAlignment: "right",
      lineHeight: 1.1,
      marginTop: 10,
    },
    {
      type: "custom_message",
      id: "separator-cg",
      message: "----------------------------\n----------------------------",
      alignment: "center",
      lineHeight: 1,
      marginTop: 10,
    },
    {
      type: "custom_message",
      id: "footer-cg",
      message: "WWW.CANADAGOOSE.COM\n#ASKANYONEWHOKNOWS",
      alignment: "center",
      lineHeight: 1.2,
      marginTop: 10,
    },
    {
      type: "barcode",
      id: "barcode-cg",
      value: "1S0H0R0800004997",
      format: "CODE128",
      displayValue: "1S0H0R0800004997",
      width: 80,
      height: 50,
      textSize: 12,
      marginTop: 15,
    },
  ],
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-start justify-center gap-8 p-8">
      <div>
        <h2 className="text-white text-sm mb-4 text-center">Original</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/test/canada-receipt-original.png"
          alt="Original"
          style={{ width: 320 }}
        />
      </div>
      <div>
        <h2 className="text-white text-sm mb-4 text-center">Generated (Renderer)</h2>
        <ReceiptRenderer data={testReceipt} />
      </div>
    </div>
  );
}
