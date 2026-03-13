"use client";

import { TextToReceiptCard } from "./TextToReceiptCard";
import { ImageUploadCard } from "./ImageUploadCard";

export function CreationChooser() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          What receipt do you want to create?
        </h2>
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Describe it in plain English or upload a reference image
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
        <TextToReceiptCard />
        <ImageUploadCard />
      </div>
    </div>
  );
}
