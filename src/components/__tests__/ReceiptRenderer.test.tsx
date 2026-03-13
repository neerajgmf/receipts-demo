import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReceiptRenderer } from "../ReceiptRenderer";
import type { ReceiptJSON } from "@/types/receipt";

const makeReceipt = (sections: ReceiptJSON["sections"]): ReceiptJSON => ({
  id: "test",
  name: "Test",
  settings: {
    currency: "$",
    currencyFormat: "prefix",
    font: "merchantcopy",
    fontSize: "16px",
    textColor: "#000000",
    pdfSize: "80mm",
    showBackground: { enabled: true, style: "1" },
    watermark: true,
  },
  sections,
});

describe("ReceiptRenderer", () => {
  it("renders a header section with business name", () => {
    const data = makeReceipt([
      {
        id: "header-1",
        type: "header",
        businessName: "TEST STORE",
        address: "123 Main St",
        alignment: "center",
        lineHeight: 1,
      },
    ]);
    render(<ReceiptRenderer data={data} />);
    expect(screen.getByText("TEST STORE")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
  });

  it("renders a custom_message section", () => {
    const data = makeReceipt([
      {
        id: "msg-1",
        type: "custom_message",
        message: "Thank you!",
        alignment: "center",
        lineHeight: 1,
      },
    ]);
    render(<ReceiptRenderer data={data} />);
    expect(screen.getByText("Thank you!")).toBeInTheDocument();
  });

  it("renders items_list with items", () => {
    const data = makeReceipt([
      {
        id: "items-1",
        type: "items_list",
        format: "2col",
        items: [
          { name: "Coffee", price: "4.50" },
          { name: "Muffin", price: "3.25" },
        ],
        lineHeight: 1,
      },
    ]);
    render(<ReceiptRenderer data={data} />);
    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Muffin")).toBeInTheDocument();
  });

  it("renders store_info key-value rows", () => {
    const data = makeReceipt([
      {
        id: "info-1",
        type: "store_info",
        rows: [
          { key: "Date", value: "01/15/2024" },
          { key: "Time", value: "10:30 AM" },
        ],
        lineHeight: 1,
      },
    ]);
    render(<ReceiptRenderer data={data} />);
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("01/15/2024")).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("renders watermark when enabled", () => {
    const data = makeReceipt([]);
    const { container } = render(<ReceiptRenderer data={data} />);
    expect(container.textContent).toContain("makereceipt.com");
  });

  it("uses serif font for luxury brands", () => {
    const data = makeReceipt([
      {
        id: "header-1",
        type: "header",
        businessName: "GUCCI",
        alignment: "center",
        lineHeight: 1,
      },
    ]);
    render(<ReceiptRenderer data={data} />);
    const nameEl = screen.getByText("GUCCI");
    expect(nameEl.style.fontFamily).toContain("Georgia");
  });
});
