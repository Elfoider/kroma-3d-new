import type { EditorElement } from "@/types/editor";

import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type LayersPanelProps = {
  elements: EditorElement[];
  selectedElementId: string | null;

  onSelectElement: (elementId: string) => void;
  onToggleVisibility: (elementId: string) => void;
  onToggleLock: (elementId: string) => void;
  onMoveUp: (elementId: string) => void;
  onMoveDown: (elementId: string) => void;
  onBringToFront: (elementId: string) => void;
  onSendToBack: (elementId: string) => void;
  onDeleteElement: (elementId: string) => void;
};

export default function LayersPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onMoveUp,
  onMoveDown,
  onBringToFront,
  onSendToBack,
  onDeleteElement,
}: LayersPanelProps) {
  const orderedElements = [...elements].sort(
    (first, second) => second.zIndex - first.zIndex,
  );

  return (
    <div className={styles.layersPanel}>
      <div className={styles.layersHeader}>
        <div>
          <h2>Capas</h2>
          <span>{elements.length} elementos</span>
        </div>
      </div>

      {orderedElements.length === 0 ? (
        <div className={styles.emptyLayers}>
          No hay elementos en el diseño.
        </div>
      ) : (
        <div className={styles.layersList}>
          {orderedElements.map((element) => {
            const isSelected = selectedElementId === element.id;

            return (
              <article
                key={element.id}
                className={`${styles.layerItem} ${
                  isSelected ? styles.selectedLayer : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.layerMainButton}
                  onClick={() => onSelectElement(element.id)}
                >
                  <span className={styles.layerTypeIcon}>
                    {element.type === "image" ? "▧" : "T"}
                  </span>

                  <span className={styles.layerInformation}>
                    <strong>
                      {element.type === "image"
                        ? element.name
                        : element.text || "Texto vacío"}
                    </strong>

                    <small>
                      {element.type === "image"
                        ? "Imagen"
                        : "Texto"}
                    </small>
                  </span>
                </button>

                <div className={styles.layerQuickActions}>
                  <button
                    type="button"
                    title={
                      element.visible
                        ? "Ocultar capa"
                        : "Mostrar capa"
                    }
                    aria-label={
                      element.visible
                        ? "Ocultar capa"
                        : "Mostrar capa"
                    }
                    onClick={() =>
                      onToggleVisibility(element.id)
                    }
                  >
                    {element.visible ? "◉" : "○"}
                  </button>

                  <button
                    type="button"
                    title={
                      element.locked
                        ? "Desbloquear capa"
                        : "Bloquear capa"
                    }
                    aria-label={
                      element.locked
                        ? "Desbloquear capa"
                        : "Bloquear capa"
                    }
                    onClick={() => onToggleLock(element.id)}
                  >
                    {element.locked ? "🔒" : "🔓"}
                  </button>
                </div>

                {isSelected && (
                  <div className={styles.layerExpandedActions}>
                    <button
                      type="button"
                      onClick={() => onBringToFront(element.id)}
                      title="Traer al frente"
                    >
                      ⇈
                    </button>

                    <button
                      type="button"
                      onClick={() => onMoveUp(element.id)}
                      title="Subir una capa"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      onClick={() => onMoveDown(element.id)}
                      title="Bajar una capa"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendToBack(element.id)}
                      title="Enviar al fondo"
                    >
                      ⇊
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteElement(element.id)}
                      title="Eliminar capa"
                      className={styles.layerDeleteButton}
                    >
                      ×
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}