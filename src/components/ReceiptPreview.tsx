"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useReceiptStore } from "@/store/receiptStore";
import { ReceiptRenderer } from "./ReceiptRenderer";
import { JsonDebugPanel } from "./JsonDebugPanel";
import { Spinner } from "./Spinner";

export function ReceiptPreview() {
  const [showJson, setShowJson] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const {
    receipt,
    isExtracting,
    isEditing,
    isGenerating,
    setReceipt,
    setError,
  } = useReceiptStore();

  const isProcessing = isExtracting || isEditing || isGenerating;

  const handleDownloadPNG = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${receipt?.id || "receipt"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setError("Failed to generate PNG");
    }
  };

  if (!receipt) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/60">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <span className="text-sm text-zinc-300">
                {isExtracting
                  ? "Extracting..."
                  : isGenerating
                    ? "Generating..."
                    : "Applying edits..."}
              </span>
            </div>
          </div>
        )}
        <ReceiptRenderer ref={receiptRef} data={receipt} />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleDownloadPNG}
          disabled={isProcessing}
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          Download PNG
        </button>
        <button
          onClick={() => setShowJson((v) => !v)}
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          {showJson ? "Hide JSON" : "Show JSON"}
        </button>
      </div>

      {showJson && <JsonDebugPanel data={receipt} onUpdate={setReceipt} />}
    </div>
  );
}
