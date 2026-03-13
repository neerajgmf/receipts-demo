"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useReceiptStore } from "@/store/receiptStore";
import { normalizeMediaType } from "@/lib/mediaType";
import { Spinner } from "./Spinner";

export function ImageUploadCard() {
  const {
    isExtracting,
    uploadedImagePreview,
    setReceipt,
    setIsExtracting,
    setError,
    setUploadedImagePreview,
    setCreationMethod,
  } = useReceiptStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setUploadedImagePreview(previewUrl);
      setCreationMethod("image");

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        const rawType = file.type || "image/jpeg";
        const mediaType = normalizeMediaType(rawType);

        if (!mediaType) {
          setError(
            `Unsupported image format: ${rawType}. Please use JPEG, PNG, GIF, or WebP.`
          );
          setIsExtracting(false);
          return;
        }

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
          setCreationMethod(null);
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsDataURL(file);
    },
    [setUploadedImagePreview, setIsExtracting, setError, setReceipt, setCreationMethod]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-white">Upload image</h3>
          <p className="text-xs text-zinc-400">Use a reference receipt photo</p>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          isDragActive
            ? "border-violet-500 bg-violet-500/10"
            : "border-zinc-700 bg-zinc-900/30 hover:border-zinc-500"
        } ${isExtracting ? "pointer-events-none opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        {uploadedImagePreview ? (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedImagePreview}
              alt="Uploaded receipt"
              className="mx-auto mb-3 max-h-24 rounded-lg object-contain"
            />
            <p className="text-sm text-zinc-400">
              {isExtracting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Extracting...
                </span>
              ) : (
                "Drop a new image to replace"
              )}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto mb-3 h-8 w-8 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
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
  );
}
