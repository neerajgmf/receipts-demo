"use client";

import { useState } from "react";
import { useReceiptStore } from "@/store/receiptStore";
import { Spinner } from "./Spinner";

export function EditorPanel() {
  const [editInstruction, setEditInstruction] = useState("");
  const {
    receipt,
    isEditing,
    isExtracting,
    isGenerating,
    editHistory,
    error,
    setReceipt,
    setIsEditing,
    setError,
    addEditHistory,
  } = useReceiptStore();

  const isProcessing = isExtracting || isEditing || isGenerating;

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleApplyEdit();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Describe your changes
        </label>
        <textarea
          value={editInstruction}
          onChange={(e) => setEditInstruction(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "Change the store to 5th Avenue location, add a $12.50 scarf"'
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

      {error && (
        <div className="rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

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
  );
}
