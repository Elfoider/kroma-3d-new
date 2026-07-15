import type {
  PointerEvent as ReactPointerEvent,
} from "react";

import type { EditorElement } from "@/types/editor";
import type { ProductType } from "@/types/product";

import DesignArea from "./DesignArea";

import styles from "./editor-components.module.css";

type ProductPreviewProps = {
  productType: ProductType;
  productColor: string;
  elements: EditorElement[];
  selectedElementId: string | null;

  onElementPointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
    elementId: string,
  ) => void;
};

export default function ProductPreview({
  productType,
  productColor,
  elements,
  selectedElementId,
  onElementPointerDown,
}: ProductPreviewProps) {
  const designArea = (
    <DesignArea
      elements={elements}
      selectedElementId={selectedElementId}
      onElementPointerDown={onElementPointerDown}
    />
  );

  return (
    <div className={styles.captureArea}>
      {productType === "taza" ? (
        <div
          className={styles.cup}
          style={{ backgroundColor: productColor }}
        >
          <div className={styles.cupTop} />

          <div className={styles.cupHandle}>
            <div
              style={{ backgroundColor: productColor }}
            />
          </div>

          {designArea}
        </div>
      ) : (
        <div className={styles.shirtContainer}>
          <div
            className={styles.shirt}
            style={{ backgroundColor: productColor }}
          >
            <div
              className={`${styles.shirtSleeve} ${styles.leftSleeve}`}
              style={{ backgroundColor: productColor }}
            />

            <div
              className={`${styles.shirtSleeve} ${styles.rightSleeve}`}
              style={{ backgroundColor: productColor }}
            />

            <div className={styles.shirtNeck} />

            {designArea}
          </div>
        </div>
      )}

      <div className={styles.productShadow} />
    </div>
  );
}