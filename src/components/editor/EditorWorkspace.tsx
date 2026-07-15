import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

import type { EditorElement } from "@/types/editor";
import type { ProductType } from "@/types/product";

import ProductPreview from "./ProductPreview";
import HistoryToolbar from "./HistoryToolbar";

import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type EditorWorkspaceProps = {
  workspaceRef: RefObject<HTMLDivElement | null>;

  productType: ProductType;
  productColor: string;
  elements: EditorElement[];
  selectedElementId: string | null;
  isGeneratingPreview: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  onWorkspacePointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;

  onStopDragging: () => void;
  onDeselectElement: () => void;

  onElementPointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
    elementId: string,
  ) => void;

  onContinueOrder: () => void;
};

export default function EditorWorkspace({
  workspaceRef,
  productType,
  productColor,
  elements,
  selectedElementId,
  isGeneratingPreview,
  onWorkspacePointerMove,
  onStopDragging,
  onDeselectElement,
  onElementPointerDown,
  onContinueOrder,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: EditorWorkspaceProps) {
  return (
    <section className={styles.workspaceSection}>
      <div className={styles.workspaceHeader}>
        <div>
          <span>VISTA PREVIA</span>
          <h2>Organiza tu diseño</h2>
        </div>

        <p>{elements.length} elementos en el diseño</p>

        <HistoryToolbar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
        />
      </div>

      <div
        ref={workspaceRef}
        className={styles.workspace}
        onPointerMove={onWorkspacePointerMove}
        onPointerUp={onStopDragging}
        onPointerCancel={onStopDragging}
        onPointerLeave={onStopDragging}
        onPointerDown={onDeselectElement}
      >
        <div
          className={styles.workspaceGrid}
          data-exclude-from-capture="true"
        />

        <ProductPreview
          productType={productType}
          productColor={productColor}
          elements={elements}
          selectedElementId={selectedElementId}
          onElementPointerDown={onElementPointerDown}
        />
      </div>

      <div className={styles.bottomActions}>
        <div>
          <span className={styles.statusDot} />
          {elements.length} elementos preparados
        </div>

        <button
          type="button"
          className={styles.continueButton}
          onClick={onContinueOrder}
          disabled={isGeneratingPreview}
        >
          {isGeneratingPreview
            ? "Generando vista previa..."
            : "Continuar pedido →"}
        </button>
      </div>
    </section>
  );
}
