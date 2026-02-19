"use client";

import { create } from "zustand";
import type { ReceiptJSON } from "@/types/receipt";

interface EditHistoryEntry {
  instruction: string;
  timestamp: number;
}

interface ReceiptState {
  receipt: ReceiptJSON | null;
  isExtracting: boolean;
  isEditing: boolean;
  error: string | null;
  editHistory: EditHistoryEntry[];
  uploadedImagePreview: string | null;

  setReceipt: (receipt: ReceiptJSON) => void;
  setIsExtracting: (v: boolean) => void;
  setIsEditing: (v: boolean) => void;
  setError: (error: string | null) => void;
  addEditHistory: (instruction: string) => void;
  setUploadedImagePreview: (url: string | null) => void;
  reset: () => void;
}

export const useReceiptStore = create<ReceiptState>((set) => ({
  receipt: null,
  isExtracting: false,
  isEditing: false,
  error: null,
  editHistory: [],
  uploadedImagePreview: null,

  setReceipt: (receipt) => set({ receipt, error: null }),
  setIsExtracting: (isExtracting) => set({ isExtracting }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setError: (error) => set({ error }),
  addEditHistory: (instruction) =>
    set((state) => ({
      editHistory: [
        ...state.editHistory,
        { instruction, timestamp: Date.now() },
      ],
    })),
  setUploadedImagePreview: (uploadedImagePreview) =>
    set({ uploadedImagePreview }),
  reset: () =>
    set({
      receipt: null,
      isExtracting: false,
      isEditing: false,
      error: null,
      editHistory: [],
      uploadedImagePreview: null,
    }),
}));
