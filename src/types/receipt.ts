export interface DividerConfig {
  enabled: boolean;
  style: "dashed" | "solid" | "double" | "blank";
}

export interface HeaderSection {
  type: "header";
  alignment?: "center" | "left" | "right";
  logoUrl?: string | null;
  businessName: string;
  address?: string;
  divider?: DividerConfig;
}

export interface StoreInfoRow {
  key: string;
  value: string;
}

export interface StoreInfoSection {
  type: "store_info";
  rows: StoreInfoRow[];
  divider?: DividerConfig;
}

export interface ReceiptItem {
  name: string;
  price: string;
  isSubItem?: boolean;
  quantity?: number;
}

export interface ItemsListSection {
  type: "items_list";
  items: ReceiptItem[];
  divider?: DividerConfig;
}

export interface PaymentLine {
  title: string;
  value: string;
  bold?: boolean;
}

export interface PaymentSection {
  type: "payment";
  customLines: PaymentLine[];
  divider?: DividerConfig;
}

export interface CustomMessageSection {
  type: "custom_message";
  alignment?: "center" | "left" | "right";
  message: string;
  divider?: DividerConfig;
}

export type ReceiptSection =
  | HeaderSection
  | StoreInfoSection
  | ItemsListSection
  | PaymentSection
  | CustomMessageSection;

export interface ReceiptSettings {
  currency: string;
  font: string;
  paperWidth: string;
  watermark: boolean;
}

export interface ReceiptJSON {
  id: string;
  name: string;
  settings: ReceiptSettings;
  sections: ReceiptSection[];
}
