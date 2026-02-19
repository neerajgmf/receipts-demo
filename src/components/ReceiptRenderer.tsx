"use client";

import { forwardRef } from "react";
import type {
  ReceiptJSON,
  ReceiptSection,
  ReceiptSettings,
  HeaderSection,
  StoreInfoSection,
  ItemsListSection,
  PaymentSection,
  CustomMessageSection,
  DividerConfig,
} from "@/types/receipt";

const LUXURY_BRANDS = [
  "DIOR",
  "CHANEL",
  "GUCCI",
  "LOUIS VUITTON",
  "HERMES",
  "HERMÈS",
  "PRADA",
  "BURBERRY",
  "VERSACE",
  "BALENCIAGA",
  "FENDI",
  "GIVENCHY",
  "CARTIER",
  "TIFFANY",
  "ROLEX",
];

function isLuxuryBrand(name: string): boolean {
  const upper = name.toUpperCase();
  return LUXURY_BRANDS.some((b) => upper.includes(b));
}

function Divider({ config }: { config?: DividerConfig }) {
  if (!config?.enabled) return null;

  switch (config.style) {
    case "dashed":
      return (
        <div
          className="my-1 border-t border-dashed border-gray-500"
          style={{ borderColor: "#888" }}
        />
      );
    case "solid":
      return (
        <div
          className="my-1 border-t border-solid"
          style={{ borderColor: "#888" }}
        />
      );
    case "double":
      return (
        <div className="my-1">
          <div
            className="border-t border-solid"
            style={{ borderColor: "#888" }}
          />
          <div
            className="mt-px border-t border-solid"
            style={{ borderColor: "#888" }}
          />
        </div>
      );
    case "blank":
    default:
      return <div className="h-2" />;
  }
}

function HeaderBlock({ section }: { section: HeaderSection }) {
  const luxury = isLuxuryBrand(section.businessName);
  const align =
    section.alignment === "right"
      ? "text-right"
      : section.alignment === "left"
        ? "text-left"
        : "text-center";

  return (
    <div className={align}>
      {section.logoUrl && (
        <div className="flex justify-center mb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={section.logoUrl}
            alt="logo"
            className="h-8 object-contain"
          />
        </div>
      )}
      <div
        className={
          luxury
            ? "text-lg tracking-[0.3em] font-bold mb-1"
            : "text-sm font-bold mb-1"
        }
        style={luxury ? { fontFamily: "Georgia, 'Times New Roman', serif" } : undefined}
      >
        {section.businessName}
      </div>
      {section.address && (
        <div className="text-xs whitespace-pre-line leading-relaxed">
          {section.address}
        </div>
      )}
      <Divider config={section.divider} />
    </div>
  );
}

function StoreInfoBlock({ section }: { section: StoreInfoSection }) {
  return (
    <div>
      {section.rows.map((row, i) => (
        <div key={i} className="flex justify-between text-xs">
          <span>{row.key}</span>
          <span>{row.value}</span>
        </div>
      ))}
      <Divider config={section.divider} />
    </div>
  );
}

function ItemsListBlock({
  section,
  settings,
}: {
  section: ItemsListSection;
  settings: ReceiptSettings;
}) {
  return (
    <div>
      {section.items.map((item, i) => (
        <div
          key={i}
          className={`flex justify-between text-xs ${item.isSubItem ? "pl-4" : ""}`}
        >
          <span className="flex-1 mr-2">
            {item.quantity && item.quantity > 1 && `${item.quantity}x `}
            {item.name}
          </span>
          <span className="whitespace-nowrap">
            {settings.currency}
            {item.price}
          </span>
        </div>
      ))}
      <Divider config={section.divider} />
    </div>
  );
}

function PaymentBlock({
  section,
  settings,
}: {
  section: PaymentSection;
  settings: ReceiptSettings;
}) {
  return (
    <div>
      {section.customLines.map((line, i) => {
        const isMoneyValue = /^\d/.test(line.value);
        return (
          <div
            key={i}
            className={`flex justify-between text-xs ${line.bold ? "font-bold" : ""}`}
          >
            <span>{line.title}</span>
            <span>
              {isMoneyValue ? settings.currency : ""}
              {line.value}
            </span>
          </div>
        );
      })}
      <Divider config={section.divider} />
    </div>
  );
}

function CustomMessageBlock({ section }: { section: CustomMessageSection }) {
  const align =
    section.alignment === "right"
      ? "text-right"
      : section.alignment === "left"
        ? "text-left"
        : "text-center";

  return (
    <div>
      <div className={`text-xs whitespace-pre-line leading-relaxed ${align}`}>
        {section.message}
      </div>
      <Divider config={section.divider} />
    </div>
  );
}

function renderSection(section: ReceiptSection, settings: ReceiptSettings) {
  switch (section.type) {
    case "header":
      return <HeaderBlock section={section} />;
    case "store_info":
      return <StoreInfoBlock section={section} />;
    case "items_list":
      return <ItemsListBlock section={section} settings={settings} />;
    case "payment":
      return <PaymentBlock section={section} settings={settings} />;
    case "custom_message":
      return <CustomMessageBlock section={section} />;
    default:
      return null;
  }
}

interface ReceiptRendererProps {
  data: ReceiptJSON;
}

export const ReceiptRenderer = forwardRef<HTMLDivElement, ReceiptRendererProps>(
  function ReceiptRenderer({ data }, ref) {
    return (
      <div
        ref={ref}
        className="relative mx-auto"
        style={{
          width: "320px",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "12px",
          lineHeight: "1.5",
          backgroundColor: "#FDFCF7",
          color: "#111",
          padding: "24px 16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Torn edge top */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "8px",
            background: "#FDFCF7",
            clipPath:
              "polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%)",
            marginTop: "-8px",
          }}
        />

        <div className="space-y-1">
          {data.sections.map((section, i) => (
            <div key={i}>{renderSection(section, data.settings)}</div>
          ))}
        </div>

        {/* Watermark */}
        {data.settings.watermark && (
          <div
            className="mt-4 text-center"
            style={{ fontSize: "9px", color: "#ccc" }}
          >
            makereceipt.com
          </div>
        )}

        {/* Torn edge bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "8px",
            background: "#FDFCF7",
            clipPath:
              "polygon(0% 0%, 2% 100%, 4% 0%, 6% 100%, 8% 0%, 10% 100%, 12% 0%, 14% 100%, 16% 0%, 18% 100%, 20% 0%, 22% 100%, 24% 0%, 26% 100%, 28% 0%, 30% 100%, 32% 0%, 34% 100%, 36% 0%, 38% 100%, 40% 0%, 42% 100%, 44% 0%, 46% 100%, 48% 0%, 50% 100%, 52% 0%, 54% 100%, 56% 0%, 58% 100%, 60% 0%, 62% 100%, 64% 0%, 66% 100%, 68% 0%, 70% 100%, 72% 0%, 74% 100%, 76% 0%, 78% 100%, 80% 0%, 82% 100%, 84% 0%, 86% 100%, 88% 0%, 90% 100%, 92% 0%, 94% 100%, 96% 0%, 98% 100%, 100% 0%)",
            marginBottom: "-8px",
          }}
        />
      </div>
    );
  }
);
