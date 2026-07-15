import type {
  PointerEvent as ReactPointerEvent,
} from "react";

import type { EditorElement } from "@/types/editor";

import styles from "./editor-components.module.css";

type DesignAreaProps = {
  elements: EditorElement[];
  selectedElementId: string | null;

  onElementPointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
    elementId: string,
  ) => void;
};

export default function DesignArea({
  elements,
  selectedElementId,
  onElementPointerDown,
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
            element.type === "image"
              ? styles.designElement
              : styles.designText
          } ${
            selectedElementId === element.id
              ? styles.selectedElement
              : ""
          } ${element.locked ? styles.lockedElement : ""}`;

          if (element.type === "image") {
            return (
              <div
                key={element.id}
                className={className}
                style={elementStyle}
                onPointerDown={(event) =>
                  onElementPointerDown(event, element.id)
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={element.src}
                  alt={element.name}
                  draggable={false}
                />
              </div>
            );
          }

          return (
            <div
              key={element.id}
              className={className}
              style={{
                ...elementStyle,
                color: element.color,
                fontSize: `${element.fontSize}px`,
                fontFamily: element.fontFamily,
              }}
              onPointerDown={(event) =>
                onElementPointerDown(event, element.id)
              }
            >
              {element.text}
            </div>
          );
        })}
    </div>
  );
}