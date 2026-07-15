import type { ChangeEvent } from "react";

import type { EditorElement } from "@/types/editor";
import type { ProductDefinition } from "@/types/product";

import ElementToolbar from "./ElementToolbar";

import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type EditorSidebarProps = {
  product: ProductDefinition;
  productColor: string;
  selectedElement: EditorElement | null;

  onImageUpload: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;

  onAddText: () => void;
  onTextChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
  onProductColorChange: (value: string) => void;

  onDecreaseElement: () => void;
  onIncreaseElement: () => void;
  onRotateElement: () => void;
  onDuplicateElement: () => void;
  onToggleElementLock: () => void;
  onDeleteElement: () => void;

  onResetDesign: () => void;
};

export default function EditorSidebar({
  product,
  productColor,
  selectedElement,
  onImageUpload,
  onAddText,
  onTextChange,
  onTextColorChange,
  onProductColorChange,
  onDecreaseElement,
  onIncreaseElement,
  onRotateElement,
  onDuplicateElement,
  onToggleElementLock,
  onDeleteElement,
  onResetDesign,
}: EditorSidebarProps) {
  const selectedText =
    selectedElement?.type === "text"
      ? selectedElement
      : null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeading}>
        <span>PERSONALIZADOR</span>
        <h1>{product.name}</h1>
        <p>{product.printAreaDescription}</p>
      </div>

      <div className={styles.controlGroup}>
        <h2>1. Agrega imágenes</h2>

        <label className={styles.uploadButton}>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={onImageUpload}
          />

          <span>＋</span>
          Subir imágenes
        </label>
      </div>

      <div className={styles.controlGroup}>
        <h2>2. Agrega textos</h2>

        <button
          type="button"
          className={styles.uploadButton}
          onClick={onAddText}
        >
          <span>＋</span>
          Nuevo texto
        </button>

        {selectedText && (
          <>
            <input
              type="text"
              value={selectedText.text}
              onChange={(event) =>
                onTextChange(event.target.value)
              }
              className={styles.textInput}
              maxLength={80}
            />

            <div className={styles.colorField}>
              <label htmlFor="text-color">
                Color del texto
              </label>

              <div>
                <input
                  id="text-color"
                  type="color"
                  value={selectedText.color}
                  onChange={(event) =>
                    onTextColorChange(event.target.value)
                  }
                />

                <span>
                  {selectedText.color.toUpperCase()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.controlGroup}>
        <h2>3. Color del producto</h2>

        <div className={styles.productColors}>
          {product.colors.map((color) => (
            <button
              key={color.value}
              type="button"
              title={color.name}
              aria-label={color.name}
              className={
                productColor === color.value
                  ? styles.selectedColor
                  : undefined
              }
              style={{ backgroundColor: color.value }}
              onClick={() =>
                onProductColorChange(color.value)
              }
            />
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <h2>Elemento seleccionado</h2>

        <ElementToolbar
          selectedElement={selectedElement}
          onDecrease={onDecreaseElement}
          onIncrease={onIncreaseElement}
          onRotate={onRotateElement}
          onDuplicate={onDuplicateElement}
          onToggleLock={onToggleElementLock}
          onDelete={onDeleteElement}
        />
      </div>

      <button
        type="button"
        className={styles.resetButton}
        onClick={onResetDesign}
      >
        Restablecer diseño
      </button>
    </aside>
  );
}