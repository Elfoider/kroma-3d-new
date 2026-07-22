import type { PointerEvent as ReactPointerEvent } from "react";

import type { EditorElement } from "@/types/editor";

import styles from "./editor-components.module.css";

type DesignAreaProps = {
  elements: EditorElement[];
  selectedElementId: string | null;

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
  isPanModeActive: boolean;
};

export default function DesignArea({
  elements,
  selectedElementId,
  onElementPointerDown,
  onScalePointerDown,
  onRotatePointerDown,
  isPanModeActive,
}: DesignAreaProps) {
  return (
    <div className={styles.designArea}>
      <div className={styles.safeArea}>
        <span>Área de impresión</span>
      </div>

      {elements
        .filter((element) => element.visible)
        .sort((first, second) => first.zIndex - second.zIndex)
        .map((element) => {
          const isSelected = selectedElementId === element.id;

          const elementStyle = {
            left: `${element.position.x}%`,
            top: `${element.position.y}%`,
            zIndex: element.zIndex,
            opacity: element.opacity,

            transform: `
              translate(-50%, -50%)
              scale(${element.scale})
              rotate(${element.rotation}deg)
            `,
          };

          const className = `${
            element.type === "image" ? styles.designElement : styles.designText
          } ${isSelected ? styles.selectedElement : ""} ${
            element.locked ? styles.lockedElement : ""
          }`;

          return (
            <div
              key={element.id}
              data-editor-element="true"
              data-element-id={element.id}
              className={className}
              style={{
                ...elementStyle,

                ...(element.type === "text"
                  ? {
                      color: element.color,
                      fontSize: `${element.fontSize}px`,
                      fontFamily: element.fontFamily,
                    }
                  : {}),
              }}
              onPointerDown={(event) => {
                if (isPanModeActive) {
                  return;
                }

                onElementPointerDown(event, element.id);
              }}
            >
              {element.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={element.src} alt={element.name} draggable={false} />
              ) : (
                element.text
              )}

              {isSelected && !element.locked && (
                <div
                  className={styles.transformControls}
                  data-exclude-from-capture="true"
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    aria-label="Escalar desde arriba a la izquierda"
                    className={`${styles.scaleHandle} ${styles.topLeftHandle}`}
                    onPointerDown={(event) =>
                      onScalePointerDown(event, element.id)
                    }
                  />

                  <button
                    type="button"
                    aria-label="Escalar desde arriba a la derecha"
                    className={`${styles.scaleHandle} ${styles.topRightHandle}`}
                    onPointerDown={(event) =>
                      onScalePointerDown(event, element.id)
                    }
                  />

                  <button
                    type="button"
                    aria-label="Escalar desde abajo a la izquierda"
                    className={`${styles.scaleHandle} ${styles.bottomLeftHandle}`}
                    onPointerDown={(event) =>
                      onScalePointerDown(event, element.id)
                    }
                  />

                  <button
                    type="button"
                    aria-label="Escalar desde abajo a la derecha"
                    className={`${styles.scaleHandle} ${styles.bottomRightHandle}`}
                    onPointerDown={(event) =>
                      onScalePointerDown(event, element.id)
                    }
                  />

                  <div className={styles.rotationLine} />

                  <button
                    type="button"
                    aria-label="Rotar elemento"
                    className={styles.rotationHandle}
                    onPointerDown={(event) =>
                      onRotatePointerDown(event, element.id)
                    }
                  >
                    ↻
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
