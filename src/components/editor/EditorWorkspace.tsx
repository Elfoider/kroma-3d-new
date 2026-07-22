import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

import type { EditorElement, ActiveGuides, PanPosition } from "@/types/editor";
import type { ProductType } from "@/types/product";

import HistoryToolbar from "./HistoryToolbar";
import ProductPreview from "./ProductPreview";
import SmartGuides from "./SmartGuides";
import ZoomToolbar from "./ZoomToolbar";

import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type EditorWorkspaceProps = {
  workspaceRef: RefObject<HTMLDivElement | null>;

  productType: ProductType;
  productColor: string;
  elements: EditorElement[];
  selectedElementId: string | null;
  activeGuides: ActiveGuides;

  isGeneratingPreview: boolean;

  canUndo: boolean;
  canRedo: boolean;

  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;

  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (zoom: number) => void;
  onFitView: () => void;

  onUndo: () => void;
  onRedo: () => void;

  onWorkspacePointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;

  onStopDragging: () => void;
  onDeselectElement: () => void;

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

  onContinueOrder: () => void;

  panPosition: PanPosition;
  isPanning: boolean;
  isPanModeActive: boolean;

  onStartPanning: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

export default function EditorWorkspace({
  workspaceRef,
  productType,
  productColor,
  elements,
  selectedElementId,
  activeGuides,
  zoom,
  canZoomIn,
  canZoomOut,
  isGeneratingPreview,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  onFitView,
  onWorkspacePointerMove,
  onStopDragging,
  onDeselectElement,
  onElementPointerDown,
  onScalePointerDown,
  onRotatePointerDown,
  onContinueOrder,
  panPosition,
  isPanning,
  isPanModeActive,
  onStartPanning,
}: EditorWorkspaceProps) {
  return (
    <section className={styles.workspaceSection}>
      <div className={styles.workspaceHeader}>
        <div>
          <span>VISTA PREVIA</span>
          <h2>Organiza tu diseño</h2>
        </div>

        <div className={styles.workspaceHeaderActions}>
          <p>{elements.length} elementos</p>

          <ZoomToolbar
            zoom={zoom}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onZoomChange={onZoomChange}
            onFitView={onFitView}
          />

          <HistoryToolbar
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
          />
        </div>
      </div>

      <div
        ref={workspaceRef}
        className={`${styles.workspace} ${
          isPanModeActive ? styles.panModeActive : ""
        } ${isPanning ? styles.panning : ""}`}
        onPointerMove={onWorkspacePointerMove}
        onPointerUp={onStopDragging}
        onPointerCancel={onStopDragging}
        onPointerLeave={onStopDragging}
        onPointerDown={(event) => {
          if (isPanModeActive) {
            onStartPanning(event);
            return;
          }

          onDeselectElement();
        }}
      >
        <div
          className={styles.workspaceGrid}
          data-exclude-from-capture="true"
        />

        <SmartGuides guides={activeGuides} />

        <ProductPreview
          productType={productType}
          productColor={productColor}
          elements={elements}
          zoom={zoom}
          selectedElementId={selectedElementId}
          onElementPointerDown={onElementPointerDown}
          onScalePointerDown={onScalePointerDown}
          onRotatePointerDown={onRotatePointerDown}
          panPosition={panPosition}
          isPanModeActive={isPanModeActive}
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
