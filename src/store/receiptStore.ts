"use client";

import { create } from "zustand";
import type { ReceiptJSON } from "@/types/receipt";

type CreationMethod = "text" | "image" | null;

interface EditHistoryEntry {
  instruction: string;
  timestamp: number;
}

interface ReceiptState {
  receipt: ReceiptJSON | null;
  isExtracting: boolean;
  isEditing: boolean;
  isGenerating: boolean;
  error: string | null;
  editHistory: EditHistoryEntry[];
  uploadedImagePreview: string | null;
  creationMethod: CreationMethod;

  setReceipt: (receipt: ReceiptJSON) => void;
  setIsExtracting: (v: boolean) => void;
  setIsEditing: (v: boolean) => void;
  setIsGenerating: (v: boolean) => void;
  setError: (error: string | null) => void;
  addEditHistory: (instruction: string) => void;
  setUploadedImagePreview: (url: string | null) => void;
  setCreationMethod: (method: CreationMethod) => void;
  reset: () => void;
}

export const useReceiptStore = create<ReceiptState>((set) => ({
  receipt: null,
  isExtracting: false,
  isEditing: false,
  isGenerating: false,
  error: null,
  editHistory: [],
  uploadedImagePreview: null,
  creationMethod: null,

  setReceipt: (receipt) => set({ receipt, error: null }),
  setIsExtracting: (isExtracting) => set({ isExtracting }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
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
  setCreationMethod: (creationMethod) => set({ creationMethod }),
  reset: () =>
    set({
      receipt: null,
      isExtracting: false,
      isEditing: false,
      isGenerating: false,
      error: null,
      editHistory: [],
      uploadedImagePreview: null,
      creationMethod: null,
    }),
}));
