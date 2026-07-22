import type { ProductType } from "./product";

export type Position = {
  x: number;
  y: number;
};

export type PanPosition = {
  x: number;
  y: number;
};

export type PanInteraction = {
  startPointerX: number;
  startPointerY: number;
  startPanX: number;
  startPanY: number;
};

export type ActiveGuides = {
  vertical: boolean;
  horizontal: boolean;
};

export type EditorElementType = "image" | "text";

export type BaseEditorElement = {
  id: string;
  type: EditorElementType;
  position: Position;
  scale: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
};

export type ImageEditorElement = BaseEditorElement & {
  type: "image";
  src: string;
  name: string;
};

export type TextEditorElement = BaseEditorElement & {
  type: "text";
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
};

export type EditorElement =
  | ImageEditorElement
  | TextEditorElement;

export type DragState = {
  elementId: string;
  startPointerX: number;
  startPointerY: number;
  startElementX: number;
  startElementY: number;
};

export type SavedDesignElement =
  | {
      type: "image";
      id: string;
      src: string;
      name: string;
      position: Position;
      scale: number;
      rotation: number;
      opacity: number;
      visible: boolean;
      locked: boolean;
      zIndex: number;
    }
  | {
      type: "text";
      id: string;
      text: string;
      color: string;
      fontSize: number;
      fontFamily: string;
      position: Position;
      scale: number;
      rotation: number;
      opacity: number;
      visible: boolean;
      locked: boolean;
      zIndex: number;
    };

export type SavedDesign = {
  productType: ProductType;
  productName: string;
  productColor: string;
  elements: SavedDesignElement[];
  previewImage: string;
  createdAt: string;

  // Compatibilidad temporal con pedidos antiguos.
  customText?: string;
  textColor?: string;
};