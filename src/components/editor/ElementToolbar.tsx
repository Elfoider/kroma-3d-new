import type { EditorElement } from "@/types/editor";

import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type ElementToolbarProps = {
  selectedElement: EditorElement | null;

  onDecrease: () => void;
  onIncrease: () => void;
  onRotate: () => void;
  onDuplicate: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
};

export default function ElementToolbar({
  selectedElement,
  onDecrease,
  onIncrease,
  onRotate,
  onDuplicate,
  onToggleLock,
  onDelete,
}: ElementToolbarProps) {
  return (
    <div>
      <div className={styles.selectionStatus}>
        {!selectedElement && "Selecciona un elemento"}

        {selectedElement?.type === "image" &&
          `Imagen: ${selectedElement.name}`}

        {selectedElement?.type === "text" &&
          `Texto: ${selectedElement.text}`}
      </div>

      <div className={styles.elementControls}>
        <button
          type="button"
          onClick={onDecrease}
          disabled={!selectedElement}
          title="Reducir"
        >
          −
        </button>

        <button
          type="button"
          onClick={onIncrease}
          disabled={!selectedElement}
          title="Aumentar"
        >
          ＋
        </button>

        <button
          type="button"
          onClick={onRotate}
          disabled={!selectedElement}
          title="Rotar"
        >
          ↻
        </button>

        <button
          type="button"
          onClick={onDuplicate}
          disabled={!selectedElement}
          title="Duplicar"
        >
          ⧉
        </button>

        <button
          type="button"
          onClick={onToggleLock}
          disabled={!selectedElement}
          title={
            selectedElement?.locked
              ? "Desbloquear"
              : "Bloquear"
          }
        >
          {selectedElement?.locked ? "🔓" : "🔒"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={!selectedElement}
          title="Eliminar"
          className={styles.deleteButton}
        >
          ×
        </button>
      </div>
    </div>
  );
}