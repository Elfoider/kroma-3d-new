import type { ProductType } from "./product";

export type Position = {
  x: number;
  y: number;
};

export type EditorElementType = "image" | "text";

export type SelectedElement = EditorElementType | null;

export type DragState = {
  element: EditorElementType;
  startPointerX: number;
  startPointerY: number;
  startElementX: number;
  startElementY: number;
};

export type SavedDesign = {
  productType: ProductType;
  productName: string;
  productColor: string;
  customText: string;
  textColor: string;
  previewImage: string;
  createdAt: string;
};