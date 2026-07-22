import type { EditorElement } from "@/types/editor";

import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type AlignmentToolbarProps = {
  selectedElement: EditorElement | null;

  onAlignLeft: () => void;
  onAlignHorizontalCenter: () => void;
  onAlignRight: () => void;

  onAlignTop: () => void;
  onAlignVerticalCenter: () => void;
  onAlignBottom: () => void;

  onAlignExactCenter: () => void;
};

export default function AlignmentToolbar({
  selectedElement,
  onAlignLeft,
  onAlignHorizontalCenter,
  onAlignRight,
  onAlignTop,
  onAlignVerticalCenter,
  onAlignBottom,
  onAlignExactCenter,
}: AlignmentToolbarProps) {
  const isDisabled =
    !selectedElement || selectedElement.locked;

  return (
    <div className={styles.alignmentToolbar}>
      <div className={styles.alignmentHeading}>
        <span>Alineación</span>
        <small>Área de impresión</small>
      </div>

      <div className={styles.alignmentGrid}>
        <button
          type="button"
          onClick={onAlignLeft}
          disabled={isDisabled}
          title="Alinear a la izquierda"
          aria-label="Alinear a la izquierda"
        >
          ⇤
        </button>

        <button
          type="button"
          onClick={onAlignHorizontalCenter}
          disabled={isDisabled}
          title="Centrar horizontalmente"
          aria-label="Centrar horizontalmente"
        >
          ↔
        </button>

        <button
          type="button"
          onClick={onAlignRight}
          disabled={isDisabled}
          title="Alinear a la derecha"
          aria-label="Alinear a la derecha"
        >
          ⇥
        </button>

        <button
          type="button"
          onClick={onAlignTop}
          disabled={isDisabled}
          title="Alinear arriba"
          aria-label="Alinear arriba"
        >
          ⇡
        </button>

        <button
          type="button"
          onClick={onAlignExactCenter}
          disabled={isDisabled}
          title="Centrar completamente"
          aria-label="Centrar completamente"
          className={styles.centerAlignmentButton}
        >
          ◎
        </button>

        <button
          type="button"
          onClick={onAlignBottom}
          disabled={isDisabled}
          title="Alinear abajo"
          aria-label="Alinear abajo"
        >
          ⇣
        </button>

        <span />

        <button
          type="button"
          onClick={onAlignVerticalCenter}
          disabled={isDisabled}
          title="Centrar verticalmente"
          aria-label="Centrar verticalmente"
        >
          ↕
        </button>

        <span />
      </div>
    </div>
  );
}