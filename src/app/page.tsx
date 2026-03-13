"use client";

import { useReceiptStore } from "@/store/receiptStore";
import { CreationChooser } from "@/components/CreationChooser";
import { EditorPanel } from "@/components/EditorPanel";
import { ReceiptPreview } from "@/components/ReceiptPreview";
import { Spinner } from "@/components/Spinner";

export default function Home() {
  const { receipt, isExtracting, isGenerating, error, reset } =
    useReceiptStore();

  const hasReceipt = !!receipt;
  const isCreating = isExtracting || isGenerating;

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
          {hasReceipt && (
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
        {hasReceipt ? (
          /* Editor Layout */
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="w-full lg:w-[420px] shrink-0">
              <EditorPanel />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <ReceiptPreview />
            </div>
          </div>
        ) : isCreating ? (
          /* Loading state while creating */
          <div className="flex flex-1 flex-col items-center justify-center py-32">
            <Spinner size="lg" />
            <p className="mt-4 text-zinc-400">
              {isExtracting
                ? "AI is reading your receipt..."
                : "AI is generating your receipt..."}
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              This usually takes 5-10 seconds
            </p>
            {error && (
              <div className="mt-4 rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        ) : (
          /* Landing — Creation Chooser */
          <>
            <CreationChooser />
            {error && (
              <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
