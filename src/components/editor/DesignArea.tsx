import type {
  PointerEvent as ReactPointerEvent,
} from "react";

import type {
  Position,
  SelectedElement,
} from "@/types/editor";

import styles from "./editor-components.module.css";

type DesignAreaProps = {
  uploadedImage: string | null;
  customText: string;
  textColor: string;

  imagePosition: Position;
  textPosition: Position;

  imageScale: number;
  textScale: number;

  imageRotation: number;
  textRotation: number;

  selectedElement: SelectedElement;

  onImagePointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => void;

  onTextPointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => void;
};

export default function DesignArea({
  uploadedImage,
  customText,
  textColor,
  imagePosition,
  textPosition,
  imageScale,
  textScale,
  imageRotation,
  textRotation,
  selectedElement,
  onImagePointerDown,
  onTextPointerDown,
}: DesignAreaProps) {
  return (
    <div className={styles.designArea}>
      <div className={styles.safeArea}>
        <span>Área de impresión</span>
      </div>

      {uploadedImage && (
        <div
          className={`${styles.designElement} ${
            selectedElement === "image"
              ? styles.selectedElement
              : ""
          }`}
          style={{
            left: `${imagePosition.x}%`,
            top: `${imagePosition.y}%`,
            transform: `
              translate(-50%, -50%)
              scale(${imageScale})
              rotate(${imageRotation}deg)
            `,
          }}
          onPointerDown={onImagePointerDown}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uploadedImage}
            alt="Diseño cargado por el usuario"
            draggable={false}
          />
        </div>
      )}

      {customText && (
        <div
          className={`${styles.designText} ${
            selectedElement === "text"
              ? styles.selectedElement
              : ""
          }`}
          style={{
            left: `${textPosition.x}%`,
            top: `${textPosition.y}%`,
            color: textColor,
            transform: `
              translate(-50%, -50%)
              scale(${textScale})
              rotate(${textRotation}deg)
            `,
          }}
          onPointerDown={onTextPointerDown}
        >
          {customText}
        </div>
      )}
    </div>
  );
}