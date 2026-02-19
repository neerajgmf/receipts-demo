"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import html2canvas from "html2canvas";
import { useReceiptStore } from "@/store/receiptStore";
import { ReceiptRenderer } from "@/components/ReceiptRenderer";

export default function Home() {
  const {
    receipt,
    isExtracting,
    isEditing,
    error,
    editHistory,
    uploadedImagePreview,
    setReceipt,
    setIsExtracting,
    setIsEditing,
    setError,
    addEditHistory,
    setUploadedImagePreview,
    reset,
  } = useReceiptStore();

  const [editInstruction, setEditInstruction] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Show preview
      const previewUrl = URL.createObjectURL(file);
      setUploadedImagePreview(previewUrl);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        const mediaType = file.type || "image/jpeg";

        setIsExtracting(true);
        setError(null);

        try {
          const res = await fetch("/api/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64, mediaType }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Extraction failed");
          setReceipt(data.receipt);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Extraction failed");
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [setUploadedImagePreview, setIsExtracting, setError, setReceipt]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".heic"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleApplyEdit = async () => {
    if (!receipt || !editInstruction.trim()) return;

    setIsEditing(true);
    setError(null);

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receipt,
          instruction: editInstruction.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Edit failed");
      setReceipt(data.receipt);
      addEditHistory(editInstruction.trim());
      setEditInstruction("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Edit failed");
    } finally {
      setIsEditing(false);
    }
  };

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleApplyEdit();
    }
  };

  const isProcessing = isExtracting || isEditing;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold">
              M
            </div>
            <h1 className="text-lg font-semibold">MakeReceipt</h1>
          </div>
          {receipt && (
            <button
              onClick={reset}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Left Panel — Controls */}
          <div className="w-full lg:w-[420px] shrink-0 space-y-6">
            {/* Upload Zone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Upload Receipt Image
              </label>
              <div
                {...getRootProps()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  isDragActive
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500"
                } ${isExtracting ? "pointer-events-none opacity-50" : ""}`}
              >
                <input {...getInputProps()} />
                {uploadedImagePreview ? (
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadedImagePreview}
                      alt="Uploaded receipt"
                      className="mx-auto mb-3 max-h-32 rounded-lg object-contain"
                    />
                    <p className="text-sm text-zinc-400">
                      {isExtracting
                        ? "Extracting receipt data..."
                        : "Drop a new image to replace"}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto mb-3 h-10 w-10 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <p className="text-sm text-zinc-300">
                      Drag & drop a receipt image
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Input — only show after extraction */}
            {receipt && (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Describe your changes
                </label>
                <textarea
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='e.g. "Change address to 123 Main St, add Chips $1.50"'
                  rows={3}
                  disabled={isProcessing}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  onClick={handleApplyEdit}
                  disabled={isProcessing || !editInstruction.trim()}
                  className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEditing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner />
                      Applying changes...
                    </span>
                  ) : (
                    "Apply Changes"
                  )}
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Edit History */}
            {editHistory.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-zinc-300">
                  Edit History
                </h3>
                <div className="space-y-1.5">
                  {editHistory.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-zinc-400"
                    >
                      <span className="mt-0.5 text-emerald-500">&#10003;</span>
                      <span>{entry.instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel — Preview */}
          <div className="flex-1 flex flex-col items-center">
            {receipt ? (
              <>
                {/* Receipt Preview */}
                <div className="relative">
                  {isProcessing && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/60">
                      <div className="flex flex-col items-center gap-2">
                        <Spinner size="lg" />
                        <span className="text-sm text-zinc-300">
                          {isExtracting ? "Extracting..." : "Applying edits..."}
                        </span>
                      </div>
                    </div>
                  )}
                  <ReceiptRenderer ref={receiptRef} data={receipt} />
                </div>

                {/* Download buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleDownloadPNG}
                    disabled={isProcessing}
                    className="rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
                  >
                    Download PNG
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                {isExtracting ? (
                  <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" />
                    <p className="text-zinc-400">
                      AI is reading your receipt...
                    </p>
                    <p className="text-xs text-zinc-600">
                      This usually takes 5–10 seconds
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 rounded-full bg-zinc-800 p-6">
                      <svg
                        className="h-12 w-12 text-zinc-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-medium text-zinc-300">
                      Upload a receipt to get started
                    </h2>
                    <p className="mt-2 max-w-xs text-sm text-zinc-500">
                      Upload any receipt image and AI will extract the data. Then describe changes in plain English.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Spinner({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <svg
      className={`${dim} animate-spin text-white`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
