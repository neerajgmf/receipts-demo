import { describe, it, expect, beforeEach } from "vitest";
import { useReceiptStore } from "../receiptStore";
import type { ReceiptJSON } from "@/types/receipt";

const mockReceipt: ReceiptJSON = {
  id: "test-receipt",
  name: "Test Receipt",
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
  sections: [],
};

describe("receiptStore", () => {
  beforeEach(() => {
    useReceiptStore.getState().reset();
  });

  it("starts with null receipt", () => {
    expect(useReceiptStore.getState().receipt).toBeNull();
  });

  it("sets receipt and clears error", () => {
    useReceiptStore.getState().setError("some error");
    useReceiptStore.getState().setReceipt(mockReceipt);

    const state = useReceiptStore.getState();
    expect(state.receipt).toEqual(mockReceipt);
    expect(state.error).toBeNull();
  });

  it("toggles isExtracting", () => {
    useReceiptStore.getState().setIsExtracting(true);
    expect(useReceiptStore.getState().isExtracting).toBe(true);
    useReceiptStore.getState().setIsExtracting(false);
    expect(useReceiptStore.getState().isExtracting).toBe(false);
  });

  it("toggles isGenerating", () => {
    useReceiptStore.getState().setIsGenerating(true);
    expect(useReceiptStore.getState().isGenerating).toBe(true);
    useReceiptStore.getState().setIsGenerating(false);
    expect(useReceiptStore.getState().isGenerating).toBe(false);
  });

  it("toggles isEditing", () => {
    useReceiptStore.getState().setIsEditing(true);
    expect(useReceiptStore.getState().isEditing).toBe(true);
  });

  it("sets and clears error", () => {
    useReceiptStore.getState().setError("test error");
    expect(useReceiptStore.getState().error).toBe("test error");
    useReceiptStore.getState().setError(null);
    expect(useReceiptStore.getState().error).toBeNull();
  });

  it("adds edit history entries", () => {
    useReceiptStore.getState().addEditHistory("change price");
    useReceiptStore.getState().addEditHistory("add item");

    const history = useReceiptStore.getState().editHistory;
    expect(history).toHaveLength(2);
    expect(history[0].instruction).toBe("change price");
    expect(history[1].instruction).toBe("add item");
    expect(history[0].timestamp).toBeLessThanOrEqual(history[1].timestamp);
  });

  it("sets creation method", () => {
    useReceiptStore.getState().setCreationMethod("text");
    expect(useReceiptStore.getState().creationMethod).toBe("text");
    useReceiptStore.getState().setCreationMethod("image");
    expect(useReceiptStore.getState().creationMethod).toBe("image");
  });

  it("resets all state", () => {
    useReceiptStore.getState().setReceipt(mockReceipt);
    useReceiptStore.getState().setIsExtracting(true);
    useReceiptStore.getState().setIsGenerating(true);
    useReceiptStore.getState().setError("err");
    useReceiptStore.getState().addEditHistory("edit");
    useReceiptStore.getState().setCreationMethod("text");

    useReceiptStore.getState().reset();

    const state = useReceiptStore.getState();
    expect(state.receipt).toBeNull();
    expect(state.isExtracting).toBe(false);
    expect(state.isEditing).toBe(false);
    expect(state.isGenerating).toBe(false);
    expect(state.error).toBeNull();
    expect(state.editHistory).toEqual([]);
    expect(state.creationMethod).toBeNull();
  });
});
