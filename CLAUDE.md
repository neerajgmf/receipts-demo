# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MakeReceipt is an AI-powered receipt editor built with Next.js App Router. Users upload receipt images, AI extracts structured data via Claude Sonnet (through OpenRouter), users edit receipts with natural language instructions, and download pixel-perfect PNG exports.

## Commands

```bash
npm run dev       # Start dev server with hot reload
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint (flat config, Next.js rules)
```

No test framework is configured.

## Architecture

**App Router structure** — all source code lives under `src/`:

- `src/app/page.tsx` — Main UI, marked `"use client"`. Handles drag-and-drop upload, image preview, API calls for extraction/editing, edit instruction input, and PNG download via html2canvas.
- `src/app/api/extract/route.ts` — POST endpoint. Takes base64 image + media type, calls Claude Sonnet 4 via OpenRouter, returns structured receipt JSON.
- `src/app/api/edit/route.ts` — POST endpoint. Takes current receipt JSON + natural language instruction, returns modified receipt JSON. Auto-recalculates totals when items/prices change.
- `src/components/ReceiptRenderer.tsx` — Client component using `forwardRef`. Renders receipt data as a styled receipt with monospace font, torn-paper edge effects (CSS clip-path), luxury brand detection (switches to serif fonts for brands like DIOR, CHANEL, GUCCI), and divider rendering.
- `src/store/receiptStore.ts` — Zustand store managing receipt data, loading states, error messages, edit history with timestamps, and uploaded image preview URL.
- `src/types/receipt.ts` — TypeScript interfaces for the receipt JSON schema: `HeaderSection`, `StoreInfoSection`, `ItemsListSection`, `PaymentSection`, `CustomMessageSection`. Each section has optional divider config (dashed/solid/double/blank).

**Data flow:** Upload image → base64 encode → POST `/api/extract` → structured JSON → Zustand store → ReceiptRenderer. Edit instructions → POST `/api/edit` with current JSON → updated JSON → store update.

**Both API routes** strip markdown fences from LLM responses, validate JSON parsing, and use `OPENROUTER_API_KEY` from `.env.local`.

## Key Technical Details

- **React Compiler** is enabled via babel-plugin-react-compiler in `next.config.ts`
- **Tailwind CSS v4** with PostCSS plugin (not the older v3 config pattern)
- **Path alias:** `@/*` maps to `./src/*`
- **TypeScript strict mode** is on
- Receipt PNG export uses html2canvas at 2x scale
- Receipt width is 320px (thermal printer standard), background `#FDFCF7`
- File upload accepts PNG, JPG, JPEG, WebP, HEIC up to 5MB
- OpenRouter model: `anthropic/claude-sonnet-4`, max tokens 4096

## Environment

Requires `.env.local` with:
```
OPENROUTER_API_KEY=<key>
```
