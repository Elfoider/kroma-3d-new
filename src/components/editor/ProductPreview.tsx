import type { PointerEvent as ReactPointerEvent } from "react";

import type { EditorElement, PanPosition } from "@/types/editor";
import type { ProductType } from "@/types/product";

import DesignArea from "./DesignArea";

import styles from "./editor-components.module.css";

type ProductPreviewProps = {
  productType: ProductType;
  productColor: string;
  elements: EditorElement[];
  selectedElementId: string | null;
  zoom: number;

  onElementPointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
    elementId: string,
  ) => void;

  onScalePointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    elementId: string,
  ) => void;

  onRotatePointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    elementId: string,
  ) => void;

  panPosition: PanPosition;
  isPanModeActive: boolean;
};

export default function ProductPreview({
  productType,
  productColor,
  elements,
  selectedElementId,
  zoom,
  panPosition,
  onElementPointerDown,
  onScalePointerDown,
  onRotatePointerDown,
  isPanModeActive,
}: ProductPreviewProps) {
  const designArea = (
    <DesignArea
      elements={elements}
      selectedElementId={selectedElementId}
      onElementPointerDown={onElementPointerDown}
      onScalePointerDown={onScalePointerDown}
      onRotatePointerDown={onRotatePointerDown}
      isPanModeActive={isPanModeActive}
    />
  );

  return (
    <div className={styles.captureArea}>
      <div
        className={styles.zoomCanvas}
        style={{
          transform: `
    translate(
      ${panPosition.x}px,
      ${panPosition.y}px
    )
    scale(${zoom / 100})
  `,
        }}
      >
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

            {designArea}
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

              {designArea}
            </div>
          </div>
        )}

        <div className={styles.productShadow} />
      </div>
    </div>
  );
}
