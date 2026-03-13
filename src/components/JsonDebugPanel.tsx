"use client";

import { useState } from "react";
import type { ReceiptJSON } from "@/types/receipt";

interface JsonDebugPanelProps {
  data: ReceiptJSON;
  onUpdate: (data: ReceiptJSON) => void;
}

export function JsonDebugPanel({ data, onUpdate }: JsonDebugPanelProps) {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  const jsonString = JSON.stringify(data, null, 2);

  const handleEdit = () => {
    setEditText(jsonString);
    setParseError(null);
    setEditMode(true);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editText);
      onUpdate(parsed);
      setEditMode(false);
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setParseError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
  };

  return (
    <div className="mt-6 w-full max-w-[640px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-300">Generated JSON</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500"
          >
            Copy
          </button>
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors px-2 py-1 rounded border border-emerald-700 hover:border-emerald-500"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      {parseError && (
        <div className="mb-2 rounded border border-red-800 bg-red-900/30 px-3 py-2 text-xs text-red-300">
          {parseError}
        </div>
      )}
      {editMode ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-xs text-zinc-300 outline-none focus:border-emerald-500"
          rows={30}
          spellCheck={false}
        />
      ) : (
        <pre className="max-h-[500px] overflow-auto rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-xs text-zinc-400">
          {jsonString}
        </pre>
      )}
    </div>
  );
}
