import type { ChangeEvent } from "react";
import ShortcutsHelp from "./ShortcutsHelp";
import type { EditorElement } from "@/types/editor";
import type { ProductDefinition } from "@/types/product";

import ElementToolbar from "./ElementToolbar";
import LayersPanel from "./LayersPanel";

import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type EditorSidebarProps = {
  product: ProductDefinition;
  productColor: string;

  elements: EditorElement[];
  selectedElement: EditorElement | null;
  selectedElementId: string | null;

  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;

  onAddText: () => void;
  onTextChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
  onProductColorChange: (value: string) => void;

  onDecreaseElement: () => void;
  onIncreaseElement: () => void;
  onRotateElement: () => void;
  onDuplicateElement: () => void;
  onToggleSelectedElementLock: () => void;
  onDeleteSelectedElement: () => void;

  onSelectElement: (elementId: string) => void;
  onToggleElementVisibility: (elementId: string) => void;
  onToggleElementLock: (elementId: string) => void;
  onMoveElementUp: (elementId: string) => void;
  onMoveElementDown: (elementId: string) => void;
  onBringElementToFront: (elementId: string) => void;
  onSendElementToBack: (elementId: string) => void;
  onDeleteElementById: (elementId: string) => void;

  onResetDesign: () => void;
};

export default function EditorSidebar({
  product,
  productColor,
  elements,
  selectedElement,
  selectedElementId,
  onImageUpload,
  onAddText,
  onTextChange,
  onTextColorChange,
  onProductColorChange,
  onDecreaseElement,
  onIncreaseElement,
  onRotateElement,
  onDuplicateElement,
  onToggleSelectedElementLock,
  onDeleteSelectedElement,
  onSelectElement,
  onToggleElementVisibility,
  onToggleElementLock,
  onMoveElementUp,
  onMoveElementDown,
  onBringElementToFront,
  onSendElementToBack,
  onDeleteElementById,
  onResetDesign,
}: EditorSidebarProps) {
  const selectedText =
    selectedElement?.type === "text" ? selectedElement : null;

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
          <div className={styles.selectedTextControls}>
            <input
              type="text"
              value={selectedText.text}
              onChange={(event) => onTextChange(event.target.value)}
              className={styles.textInput}
              maxLength={80}
            />

            <div className={styles.colorField}>
              <label htmlFor="text-color">Color del texto</label>

              <div>
                <input
                  id="text-color"
                  type="color"
                  value={selectedText.color}
                  onChange={(event) => onTextColorChange(event.target.value)}
                />

                <span>{selectedText.color.toUpperCase()}</span>
              </div>
            </div>
          </div>
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
                productColor === color.value ? styles.selectedColor : undefined
              }
              style={{ backgroundColor: color.value }}
              onClick={() => onProductColorChange(color.value)}
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
          onToggleLock={onToggleSelectedElementLock}
          onDelete={onDeleteSelectedElement}
        />
      </div>

      <div className={styles.controlGroup}>
        <LayersPanel
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          onToggleVisibility={onToggleElementVisibility}
          onToggleLock={onToggleElementLock}
          onMoveUp={onMoveElementUp}
          onMoveDown={onMoveElementDown}
          onBringToFront={onBringElementToFront}
          onSendToBack={onSendElementToBack}
          onDeleteElement={onDeleteElementById}
        />
      </div>
      <ShortcutsHelp />

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
