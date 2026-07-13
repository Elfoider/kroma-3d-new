import type { SavedDesign } from "./editor";

export type OrderStatus =
  | "pendiente"
  | "revision"
  | "aprobado"
  | "produccion"
  | "terminado"
  | "entregado"
  | "cancelado";

export type OrderFormData = {
  customerName: string;
  phone: string;
  email: string;
  quantity: number;
  size: string;
  notes: string;
};

export type CustomerData = {
  name: string;
  phone: string;
  email: string;
};

export type OrderProductData = {
  type: SavedDesign["productType"];
  name: string;
  color: string;
  quantity: number;
  size: string | null;
};

export type OrderDesignData = {
  customText: string;
  textColor: string;
  previewImageUrl: string;
};

export type CreateOrderInput = {
  customer: CustomerData;
  product: OrderProductData;
  design: OrderDesignData;
  notes: string;
  status: OrderStatus;
};