import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CreationChooser } from "../CreationChooser";
import { useReceiptStore } from "@/store/receiptStore";

describe("CreationChooser", () => {
  beforeEach(() => {
    useReceiptStore.getState().reset();
  });

  it("renders the heading", () => {
    render(<CreationChooser />);
    expect(
      screen.getByText("What receipt do you want to create?")
    ).toBeInTheDocument();
  });

  it("renders both card titles", () => {
    render(<CreationChooser />);
    expect(screen.getByText("Describe it")).toBeInTheDocument();
    expect(screen.getByText("Upload image")).toBeInTheDocument();
  });

  it("renders the generate button", () => {
    render(<CreationChooser />);
    expect(screen.getByText("Generate Receipt")).toBeInTheDocument();
  });

  it("renders the description textarea", () => {
    render(<CreationChooser />);
    expect(
      screen.getByPlaceholderText(/Starbucks receipt/i)
    ).toBeInTheDocument();
  });

  it("renders the dropzone text", () => {
    render(<CreationChooser />);
    expect(
      screen.getByText("Drag & drop a receipt image")
    ).toBeInTheDocument();
  });

  it("disables Generate button when textarea is empty", () => {
    render(<CreationChooser />);
    const btn = screen.getByText("Generate Receipt");
    expect(btn).toBeDisabled();
  });
});
