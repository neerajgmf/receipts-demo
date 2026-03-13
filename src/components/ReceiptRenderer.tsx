"use client";

import { forwardRef } from "react";
import type {
  ReceiptJSON,
  ReceiptSection,
  ReceiptSettings,
  HeaderSection,
  LogoSection,
  BusinessInfoSection,
  StoreInfoSection,
  ItemsListSection,
  PaymentSection,
  CustomMessageSection,
  ThreeColumnSection,
  FourColumnSection,
  FiveColumnSection,
  BarcodeSection,
  DividerConfig,
} from "@/types/receipt";

const LUXURY_BRANDS = [
  "DIOR", "CHANEL", "GUCCI", "LOUIS VUITTON", "HERMES", "HERMÈS",
  "PRADA", "BURBERRY", "VERSACE", "BALENCIAGA", "FENDI", "GIVENCHY",
  "CARTIER", "TIFFANY", "ROLEX", "MCM", "CANADA GOOSE",
];

function isLuxuryBrand(name: string): boolean {
  const upper = name.toUpperCase();
  return LUXURY_BRANDS.some((b) => upper.includes(b));
}

function getAlignClass(alignment?: string) {
  if (alignment === "right") return "text-right";
  if (alignment === "left") return "text-left";
  return "text-center";
}

function Divider({ config }: { config?: DividerConfig }) {
  if (!config?.enabled) return null;

  switch (config.style) {
    case "dashed":
    case "---":
      return (
        <div
          className="my-1 overflow-hidden"
          style={{ borderTop: "1px dashed #888" }}
        />
      );
    case "solid":
      return (
        <div
          className="my-1"
          style={{ borderTop: "1px solid #888" }}
        />
      );
    case "double":
    case "===":
      return (
        <div className="my-1">
          <div style={{ borderTop: "1px solid #888" }} />
          <div className="mt-px" style={{ borderTop: "1px solid #888" }} />
        </div>
      );
    case "***":
      return (
        <div className="my-1 text-center text-xs" style={{ color: "#888" }}>
          {"*".repeat(40)}
        </div>
      );
    case "blank":
    default:
      return <div className="h-2" />;
  }
}

function SectionWrapper({
  children,
  marginTop,
  lineHeight,
}: {
  children: React.ReactNode;
  marginTop?: number;
  lineHeight?: number;
}) {
  return (
    <div
      style={{
        marginTop: marginTop !== undefined ? `${marginTop}px` : undefined,
        lineHeight: lineHeight !== undefined ? lineHeight : undefined,
      }}
    >
      {children}
    </div>
  );
}

function HeaderBlock({ section }: { section: HeaderSection }) {
  const luxury = isLuxuryBrand(section.businessName);
  const align = getAlignClass(section.alignment);

  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div className={align}>
        {section.showLogo !== false && section.logoUrl && (
          <div
            className="flex justify-center"
            style={{
              marginTop: section.logoMarginTop,
              marginBottom: section.logoMarginBottom ?? 4,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.logoUrl}
              alt="logo"
              style={{ width: section.logoWidth ?? 80, objectFit: "contain" }}
            />
          </div>
        )}
        {section.businessName && (
          <div
            className={luxury ? "tracking-[0.3em] font-bold mb-1" : "font-bold mb-1"}
            style={{
              fontSize: section.businessNameSize ?? (luxury ? 18 : 14),
              fontFamily: luxury ? "Georgia, 'Times New Roman', serif" : undefined,
            }}
          >
            {section.businessName}
          </div>
        )}
        {section.address && (
          <div
            className={`whitespace-pre-line ${getAlignClass(section.addressAlignment)}`}
            style={{
              fontSize: 12,
              lineHeight: section.addressLineHeight ?? 1.1,
            }}
          >
            {section.address}
          </div>
        )}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function LogoBlock({ section }: { section: LogoSection }) {
  if (!section.logoUrl) return null;
  return (
    <SectionWrapper>
      <div className={getAlignClass(section.alignment)}>
        <div
          className="flex justify-center"
          style={{
            marginTop: section.logoMarginTop,
            marginBottom: section.logoMarginBottom ?? 4,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={section.logoUrl}
            alt="logo"
            style={{ width: section.logoWidth ?? 80, objectFit: "contain" }}
          />
        </div>
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function BusinessInfoBlock({ section }: { section: BusinessInfoSection }) {
  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div className={getAlignClass(section.alignment)}>
        {section.businessName && (
          <div
            className={section.businessNameBold ? "font-bold" : ""}
            style={{
              fontSize: section.businessNameSize ?? 14,
              lineHeight: section.businessNameLineHeight,
            }}
          >
            {section.businessName}
          </div>
        )}
        {section.address && (
          <div
            className="whitespace-pre-line"
            style={{
              fontSize: section.addressSize ?? 12,
              lineHeight: section.addressLineHeight ?? 1.1,
            }}
          >
            {section.address}
          </div>
        )}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function StoreInfoBlock({ section }: { section: StoreInfoSection }) {
  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div>
        {section.rows.map((row, i) => (
          <div key={i} className={`flex justify-between gap-2 ${section.bold ? "font-bold" : ""}`}>
            <span className={`shrink-0 ${getAlignClass(section.keyAlignment)}`}>{row.key}</span>
            <span className={`text-right ${getAlignClass(section.valueAlignment)}`}>{row.value}</span>
          </div>
        ))}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function ItemsListBlock({
  section,
  settings,
}: {
  section: ItemsListSection;
  settings: ReceiptSettings;
}) {
  const format = section.format ?? "2col";
  const currPrefix = settings.currencyFormat !== "none" ? settings.currency : "";

  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div>
        <Divider config={section.divider} />

        {section.showColumnHeaders && section.columnLabels && (
          <>
            {format === "4col" ? (
              <div className={`flex ${section.headerBold ? "font-bold" : ""}`}>
                <span className="flex-[3] text-left">{section.columnLabels.name ?? "Item"}</span>
                <span className="w-8 text-center">{section.columnLabels.quantity ?? "Qty"}</span>
                <span className="w-[72px] text-right">{section.columnLabels.unitPrice ?? "Price"}</span>
                <span className="w-[60px] text-right">{section.columnLabels.price ?? "Total"}</span>
              </div>
            ) : format === "3col" ? (
              <div className={`flex ${section.headerBold ? "font-bold" : ""}`}>
                <span className="flex-[3] text-left">{section.columnLabels.name ?? "Item"}</span>
                <span className="w-8 text-center">{section.columnLabels.quantity ?? "Qty"}</span>
                <span className="w-[72px] text-right">{section.columnLabels.price ?? "Total"}</span>
              </div>
            ) : (
              <div className={`flex justify-between ${section.headerBold ? "font-bold" : ""}`}>
                <span className="flex-1 text-left">{section.columnLabels.name ?? "Item"}</span>
                <span className="w-[72px] text-right">{section.columnLabels.price ?? "Total"}</span>
              </div>
            )}
            <div style={{ borderTop: "1px dashed #888" }} className="my-1" />
          </>
        )}

        {section.items.map((item, i) => {
          if (item.isDescription) {
            return (
              <div key={i}>
                {item.name || "\u00A0"}
              </div>
            );
          }

          if (format === "4col") {
            return (
              <div key={i} className={`flex ${item.isSubItem ? "pl-4" : ""}`}>
                <span className="flex-[3] mr-1">{item.name}</span>
                <span className="w-8 text-center">{item.quantity ?? ""}</span>
                <span className="w-[72px] text-right">
                  {item.unitPrice ? `${currPrefix}${item.unitPrice}` : ""}
                </span>
                <span className="w-[60px] text-right whitespace-nowrap">
                  {item.price ? `${currPrefix}${item.price}` : ""}
                </span>
              </div>
            );
          }

          if (format === "3col") {
            return (
              <div key={i} className={`flex ${item.isSubItem ? "pl-4" : ""}`}>
                <span className="flex-[3] mr-1">{item.name}</span>
                <span className="w-8 text-center">{item.quantity ?? ""}</span>
                <span className="w-[72px] text-right whitespace-nowrap">
                  {item.price ? `${currPrefix}${item.price}` : ""}
                </span>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`flex justify-between ${item.isSubItem ? "pl-4" : ""}`}
            >
              <span className="flex-1 mr-2">{item.name}</span>
              <span className="w-[72px] text-right whitespace-nowrap">
                {item.price ? `${currPrefix}${item.price}` : ""}
              </span>
            </div>
          );
        })}

        {section.showTotals && (
          <>
            {section.totalLinesDivider?.enabled && (
              <Divider config={section.totalLinesDivider as DividerConfig} />
            )}
            {section.totalLines?.map((line, i) => (
              <div key={i} className="flex justify-between">
                <span className={getAlignClass(section.totalsKeyAlignment)}>{line.title}</span>
                <span>{line.value}</span>
              </div>
            ))}
            {section.total && (
              <div
                className="flex justify-between font-bold"
                style={
                  section.increaseTotalSize?.enabled
                    ? { fontSize: "1.2em" }
                    : undefined
                }
              >
                <span className={getAlignClass(section.totalKeyAlignment)}>{section.total.title}</span>
                <span>{section.total.value}</span>
              </div>
            )}
          </>
        )}

        <Divider config={section.bottomDivider} />
      </div>
    </SectionWrapper>
  );
}

function PaymentBlock({
  section,
  settings,
}: {
  section: PaymentSection;
  settings: ReceiptSettings;
}) {
  const lines = section.method === "Cash"
    ? (section.cashLines ?? section.customLines ?? [])
    : (section.customLines ?? section.cardLines ?? []);

  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div>
        {section.cardDetails && (
          <div>
            <div className="flex justify-between">
              <span>{section.cardDetails.cardType}</span>
              <span>{section.cardDetails.cardNumber}</span>
            </div>
          </div>
        )}
        {lines.map((line, i) => {
          const isMoneyValue = /^\d/.test(line.value);
          return (
            <div
              key={i}
              className={`flex justify-between ${line.bold ? "font-bold" : ""}`}
            >
              <span>{line.title}</span>
              <span>
                {isMoneyValue && settings.currencyFormat !== "none" ? settings.currency : ""}
                {line.value}
              </span>
            </div>
          );
        })}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function CustomMessageBlock({ section }: { section: CustomMessageSection }) {
  const align = getAlignClass(section.alignment);

  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div>
        <div
          className={`whitespace-pre-line ${align} ${section.bold ? "font-bold" : ""}`}
          style={{ fontSize: section.fontSize ? `${section.fontSize}px` : undefined }}
        >
          {section.message}
        </div>
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function ThreeColumnBlock({ section }: { section: ThreeColumnSection }) {
  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div>
        {section.rows.map((row, i) => (
          <div
            key={i}
            className={`flex ${section.bold ? "font-bold" : ""}`}
          >
            <span className={`flex-1 ${getAlignClass(section.leftAlignment)}`}>{row.left}</span>
            <span className={`w-8 ${getAlignClass(section.centerAlignment)}`}>{row.center}</span>
            <span className={`w-24 ${getAlignClass(section.rightAlignment ?? "right")}`}>{row.right}</span>
          </div>
        ))}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function FourColumnBlock({ section }: { section: FourColumnSection }) {
  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div>
        {section.rows.map((row, i) => (
          <div key={i} className="flex">
            <span className="flex-1">{row.col1}</span>
            <span className="flex-1">{row.col2}</span>
            <span className="flex-1">{row.col3}</span>
            <span className="flex-1 text-right">{row.col4}</span>
          </div>
        ))}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function FiveColumnBlock({ section }: { section: FiveColumnSection }) {
  return (
    <SectionWrapper marginTop={section.marginTop} lineHeight={section.lineHeight}>
      <div>
        {section.rows.map((row, i) => {
          const vals = Object.values(row);
          return (
            <div key={i} className="flex">
              {vals.map((v, j) => (
                <span key={j} className={`flex-1 ${j === vals.length - 1 ? "text-right" : ""}`}>
                  {v}
                </span>
              ))}
            </div>
          );
        })}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function BarcodeBlock({ section }: { section: BarcodeSection }) {
  return (
    <SectionWrapper marginTop={section.marginTop}>
      <div className="text-center">
        <div
          className="mx-auto"
          style={{
            height: section.height ?? 50,
            width: section.width ? `${section.width}%` : "80%",
            background: `repeating-linear-gradient(
              90deg,
              #000 0px, #000 1.5px,
              transparent 1.5px, transparent 3px,
              #000 3px, #000 4px,
              transparent 4px, transparent 5.5px,
              #000 5.5px, #000 7px,
              transparent 7px, transparent 9px
            )`,
          }}
        />
        {(section.displayValue || section.value) && (
          <div
            style={{
              fontSize: section.textSize ?? 12,
              marginTop: section.textMarginTop ?? 4,
              letterSpacing: "0.2em",
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            {section.displayValue || section.value}
          </div>
        )}
        <Divider config={section.divider} />
      </div>
    </SectionWrapper>
  );
}

function renderSection(section: ReceiptSection, settings: ReceiptSettings) {
  switch (section.type) {
    case "header":
      return <HeaderBlock section={section} />;
    case "logo":
      return <LogoBlock section={section} />;
    case "business_info":
      return <BusinessInfoBlock section={section} />;
    case "store_info":
      return <StoreInfoBlock section={section} />;
    case "items_list":
      return <ItemsListBlock section={section} settings={settings} />;
    case "payment":
      return <PaymentBlock section={section} settings={settings} />;
    case "custom_message":
      return <CustomMessageBlock section={section} />;
    case "three_column":
      return <ThreeColumnBlock section={section} />;
    case "four_column":
      return <FourColumnBlock section={section} />;
    case "five_column":
      return <FiveColumnBlock section={section} />;
    case "barcode":
      return <BarcodeBlock section={section} />;
    default:
      return null;
  }
}

const FONT_MAP: Record<string, string> = {
  merchantcopy: "'Courier New', Courier, monospace",
  helvetica: "Helvetica, Arial, sans-serif",
  bitmatrix: "'Courier New', Courier, monospace",
};

interface ReceiptRendererProps {
  data: ReceiptJSON;
}

export const ReceiptRenderer = forwardRef<HTMLDivElement, ReceiptRendererProps>(
  function ReceiptRenderer({ data }, ref) {
    const fontFamily = FONT_MAP[data.settings.font] ?? "'Courier New', Courier, monospace";
    const fontSize = data.settings.fontSize ?? "14px";

    return (
      <div
        ref={ref}
        className="relative mx-auto"
        style={{
          width: "320px",
          fontFamily,
          fontSize,
          lineHeight: "1.3",
          backgroundColor: "#FDFCF7",
          color: data.settings.textColor ?? "#111",
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

        <div>
          {data.sections.map((section, i) => (
            <div key={section.id ?? i}>{renderSection(section, data.settings)}</div>
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
