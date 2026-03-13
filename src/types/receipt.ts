export interface DividerConfig {
  enabled: boolean;
  style: "---" | "===" | "solid" | "blank" | "***" | "dashed" | "double";
}

export interface HeaderSection {
  type: "header";
  id?: string;
  showLogo?: boolean;
  logoUrl?: string | null;
  logoWidth?: number;
  logoMarginTop?: number;
  logoMarginBottom?: number;
  businessName: string;
  businessNameSize?: number;
  address?: string;
  addressAlignment?: "left" | "center" | "right";
  addressLineHeight?: number;
  alignment?: "center" | "left" | "right";
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export interface LogoSection {
  type: "logo";
  id?: string;
  logoUrl?: string | null;
  logoWidth?: number;
  logoMarginTop?: number;
  logoMarginBottom?: number;
  alignment?: "left" | "center" | "right";
  divider?: DividerConfig;
}

export interface BusinessInfoSection {
  type: "business_info";
  id?: string;
  businessName: string;
  businessNameSize?: number;
  businessNameBold?: boolean;
  businessNameLineHeight?: number;
  address?: string;
  addressSize?: number;
  addressLineHeight?: number;
  alignment?: "left" | "center" | "right";
  marginTop?: number;
  lineHeight?: number;
  divider?: DividerConfig;
}

export interface StoreInfoRow {
  key: string;
  value: string;
}

export interface StoreInfoSection {
  type: "store_info";
  id?: string;
  rows: StoreInfoRow[];
  keyAlignment?: "left" | "center" | "right";
  valueAlignment?: "left" | "center" | "right";
  bold?: boolean;
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export interface ReceiptItem {
  name: string;
  price: string;
  quantity?: string;
  unitPrice?: string;
  isSubItem?: boolean;
  isDescription?: boolean;
}

export interface TotalLine {
  title: string;
  value: string;
}

export interface ItemsListSection {
  type: "items_list";
  id?: string;
  format?: "2col" | "3col" | "4col";
  items: ReceiptItem[];
  showColumnHeaders?: boolean;
  columnLabels?: {
    name?: string;
    quantity?: string;
    unitPrice?: string;
    price?: string;
  };
  headerBold?: boolean;
  nameAlignment?: "left" | "center" | "right";
  priceAlignment?: "left" | "center" | "right";
  quantityAlignment?: "left" | "center" | "right";
  unitPriceAlignment?: "left" | "center" | "right";
  showTotals?: boolean;
  totalLines?: TotalLine[];
  total?: { title: string; value: string };
  increaseTotalSize?: { enabled: boolean; percentage: string };
  totalLinesDivider?: { enabled: boolean; style: string };
  totalsKeyAlignment?: "left" | "center" | "right";
  totalKeyAlignment?: "left" | "center" | "right";
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
  bottomDivider?: DividerConfig;
}

export interface PaymentLine {
  title: string;
  value: string;
  bold?: boolean;
}

export interface PaymentSection {
  type: "payment";
  id?: string;
  method?: "Cash" | "Credit Card";
  cardDetails?: { cardType: string; cardNumber: string };
  customLines?: PaymentLine[];
  cashLines?: PaymentLine[];
  cardLines?: PaymentLine[];
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export interface CustomMessageSection {
  type: "custom_message";
  id?: string;
  alignment?: "center" | "left" | "right";
  message: string;
  bold?: boolean;
  fontSize?: number;
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export interface ThreeColumnRow {
  left: string;
  center: string;
  right: string;
}

export interface ThreeColumnSection {
  type: "three_column";
  id?: string;
  rows: ThreeColumnRow[];
  leftAlignment?: "left" | "center" | "right";
  centerAlignment?: "left" | "center" | "right";
  rightAlignment?: "left" | "center" | "right";
  bold?: boolean;
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export interface FourColumnRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
}

export interface FourColumnSection {
  type: "four_column";
  id?: string;
  rows: FourColumnRow[];
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export interface FiveColumnSection {
  type: "five_column";
  id?: string;
  rows: Record<string, string>[];
  showColumnHeaders?: boolean;
  lineHeight?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export interface BarcodeSection {
  type: "barcode";
  id?: string;
  value: string;
  format?: string;
  displayValue?: string;
  width?: number;
  height?: number;
  textSize?: number;
  textMarginTop?: number;
  marginTop?: number;
  divider?: DividerConfig;
}

export type ReceiptSection =
  | HeaderSection
  | LogoSection
  | BusinessInfoSection
  | StoreInfoSection
  | ItemsListSection
  | PaymentSection
  | CustomMessageSection
  | ThreeColumnSection
  | FourColumnSection
  | FiveColumnSection
  | BarcodeSection;

export interface ReceiptSettings {
  currency: string;
  currencyFormat?: "prefix" | "before" | "none";
  font: string;
  fontSize?: string;
  textColor?: string;
  pdfSize?: string;
  paperWidth?: string;
  showBackground?: { enabled: boolean; style: string };
  watermark: boolean;
}

export interface ReceiptJSON {
  id: string;
  name: string;
  settings: ReceiptSettings;
  sections: ReceiptSection[];
}
