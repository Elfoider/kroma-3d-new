import type {
  PointerEvent as ReactPointerEvent,
} from "react";

import type { ProductType } from "@/types/product";
import type {
  Position,
  SelectedElement,
} from "@/types/editor";

import DesignArea from "./DesignArea";

import styles from "./editor-components.module.css";

type ProductPreviewProps = {
  productType: ProductType;
  productColor: string;

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

export default function ProductPreview({
  productType,
  productColor,
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
}: ProductPreviewProps) {
  const designAreaProps = {
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
  };

  return (
    <div className={styles.captureArea}>
      {productType === "taza" ? (
        <div
          className={styles.cup}
          style={{
            backgroundColor: productColor,
          }}
        >
          <div className={styles.cupTop} />

          <div className={styles.cupHandle}>
            <div
              style={{
                backgroundColor: productColor,
              }}
            />
          </div>

          <DesignArea {...designAreaProps} />
        </div>
      ) : (
        <div className={styles.shirtContainer}>
          <div
            className={styles.shirt}
            style={{
              backgroundColor: productColor,
            }}
          >
            <div
              className={`${styles.shirtSleeve} ${styles.leftSleeve}`}
              style={{
                backgroundColor: productColor,
              }}
            />

            <div
              className={`${styles.shirtSleeve} ${styles.rightSleeve}`}
              style={{
                backgroundColor: productColor,
              }}
            />

            <div className={styles.shirtNeck} />

            <DesignArea {...designAreaProps} />
          </div>
        </div>
      )}

      <div className={styles.productShadow} />
    </div>
  );
}