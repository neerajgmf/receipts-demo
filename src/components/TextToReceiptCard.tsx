"use client";

import { useState } from "react";
import { useReceiptStore } from "@/store/receiptStore";
import { Spinner } from "./Spinner";

export function TextToReceiptCard() {
  const [description, setDescription] = useState("");
  const {
    isGenerating,
    setIsGenerating,
    setReceipt,
    setError,
    setCreationMethod,
  } = useReceiptStore();

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCreationMethod("text");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setReceipt(data.receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setCreationMethod(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-white">Describe it</h3>
          <p className="text-xs text-zinc-400">Tell us what receipt you need</p>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={'e.g. "A Starbucks receipt for a Grande Latte $5.75 and a Blueberry Muffin $3.45, paid with Visa ending 4242, at the Times Square location"'}
        rows={5}
        disabled={isGenerating}
        className="mb-4 flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-emerald-500 disabled:opacity-50"
      />

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !description.trim()}
        className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner />
            Generating receipt...
          </span>
        ) : (
          "Generate Receipt"
        )}
      </button>

      <p className="mt-2 text-center text-xs text-zinc-500">
        Cmd+Enter to generate
      </p>
    </div>
  );
}
