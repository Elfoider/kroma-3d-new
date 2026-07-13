"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";

import {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";

import ProductPreview from "@/components/editor/ProductPreview";
import { PRODUCTS } from "@/constants/products";

import type { ProductType } from "@/types/product";
import type {
  DragState,
  Position,
  SelectedElement,
} from "@/types/editor";

import styles from "./personalizer.module.css";

type PersonalizerEditorProps = {
  productType: ProductType;
};

export default function PersonalizerEditor({
  productType,
}: PersonalizerEditorProps) {
  const router = useRouter();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const product = PRODUCTS[productType];

  const [uploadedImage, setUploadedImage] = useState<string | null>(
    null,
  );

  const [customText, setCustomText] = useState("Tu diseño");
  const [textColor, setTextColor] = useState("#7b2eff");

  const [productColor, setProductColor] = useState(
    product.colors[0]?.value ?? "#ffffff",
  );

  const [imagePosition, setImagePosition] = useState<Position>({
    x: 50,
    y: 45,
  });

  const [textPosition, setTextPosition] = useState<Position>({
    x: 50,
    y: 72,
  });

  const [imageScale, setImageScale] = useState(1);
  const [textScale, setTextScale] = useState(1);

  const [imageRotation, setImageRotation] = useState(0);
  const [textRotation, setTextRotation] = useState(0);

  const [selectedElement, setSelectedElement] =
    useState<SelectedElement>(null);

  const [dragState, setDragState] = useState<DragState | null>(
    null,
  );

  const [isGeneratingPreview, setIsGeneratingPreview] =
    useState(false);

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Selecciona un archivo de imagen válido.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setUploadedImage(reader.result);
      setSelectedElement("image");

      setImagePosition({
        x: 50,
        y: 45,
      });

      setImageScale(1);
      setImageRotation(0);
    };

    reader.onerror = () => {
      alert("No se pudo cargar la imagen.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function startDragging(
    event: ReactPointerEvent<HTMLDivElement>,
    element: Exclude<SelectedElement, null>,
    position: Position,
  ) {
    event.preventDefault();
    event.stopPropagation();

    setSelectedElement(element);

    event.currentTarget.setPointerCapture(event.pointerId);

    setDragState({
      element,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startElementX: position.x,
      startElementY: position.y,
    });
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!dragState || !workspaceRef.current) {
      return;
    }

    const workspace =
      workspaceRef.current.getBoundingClientRect();

    const movementX =
      ((event.clientX - dragState.startPointerX) /
        workspace.width) *
      100;

    const movementY =
      ((event.clientY - dragState.startPointerY) /
        workspace.height) *
      100;

    const nextPosition = {
      x: clamp(dragState.startElementX + movementX, 5, 95),
      y: clamp(dragState.startElementY + movementY, 5, 95),
    };

    if (dragState.element === "image") {
      setImagePosition(nextPosition);
    }

    if (dragState.element === "text") {
      setTextPosition(nextPosition);
    }
  }

  function stopDragging() {
    setDragState(null);
  }

  function increaseSelectedElement() {
    if (selectedElement === "image") {
      setImageScale((current) =>
        clamp(current + 0.1, 0.3, 3),
      );
    }

    if (selectedElement === "text") {
      setTextScale((current) =>
        clamp(current + 0.1, 0.5, 3),
      );
    }
  }

  function decreaseSelectedElement() {
    if (selectedElement === "image") {
      setImageScale((current) =>
        clamp(current - 0.1, 0.3, 3),
      );
    }

    if (selectedElement === "text") {
      setTextScale((current) =>
        clamp(current - 0.1, 0.5, 3),
      );
    }
  }

  function rotateSelectedElement() {
    if (selectedElement === "image") {
      setImageRotation((current) => current + 15);
    }

    if (selectedElement === "text") {
      setTextRotation((current) => current + 15);
    }
  }

  function deleteSelectedElement() {
    if (selectedElement === "image") {
      setUploadedImage(null);
    }

    if (selectedElement === "text") {
      setCustomText("");
    }

    setSelectedElement(null);
  }

  function resetDesign() {
    setUploadedImage(null);
    setCustomText("Tu diseño");
    setTextColor("#7b2eff");

    setProductColor(
      product.colors[0]?.value ?? "#ffffff",
    );

    setImagePosition({
      x: 50,
      y: 45,
    });

    setTextPosition({
      x: 50,
      y: 72,
    });

    setImageScale(1);
    setTextScale(1);

    setImageRotation(0);
    setTextRotation(0);

    setSelectedElement(null);
    setDragState(null);
  }

  async function continueToOrder() {
    const workspaceElement = workspaceRef.current;

    if (!workspaceElement) {
      alert("No se pudo encontrar la vista previa.");
      return;
    }

    try {
      setIsGeneratingPreview(true);
      setSelectedElement(null);

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 200);
      });

      const previewImage = await toPng(workspaceElement, {
        cacheBust: true,
        pixelRatio: 1.5,
        backgroundColor: "#080d19",

        filter: (node) => {
          if (!(node instanceof HTMLElement)) {
            return true;
          }

          return !node.dataset.excludeFromCapture;
        },
      });

      const savedDesign = {
        productType,
        productName: product.name,
        productColor,
        customText,
        textColor,
        previewImage,
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem(
        "kroma3d-current-design",
        JSON.stringify(savedDesign),
      );

      router.push("/pedido");
    } catch (error) {
      console.error(
        "Error al generar la vista previa:",
        error,
      );

      alert(
        "No se pudo generar la imagen del diseño. Intenta nuevamente.",
      );
    } finally {
      setIsGeneratingPreview(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo-kroma-3d.png"
            alt="KROMA 3D"
            width={46}
            height={46}
            priority
          />

          <div>
            <strong>KROMA 3D</strong>
            <span>Editor de personalización</span>
          </div>
        </Link>

        <Link href="/" className={styles.backButton}>
          ← Volver al inicio
        </Link>
      </header>

      <section className={styles.editorLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeading}>
            <span>PERSONALIZADOR</span>
            <h1>{product.name}</h1>
            <p>{product.printAreaDescription}</p>
          </div>

          <div className={styles.controlGroup}>
            <h2>1. Agrega una imagen</h2>

            <label className={styles.uploadButton}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
              />

              <span>＋</span>
              Subir imagen
            </label>

            <small>
              Formatos permitidos: PNG, JPG y WEBP.
            </small>
          </div>

          <div className={styles.controlGroup}>
            <h2>2. Agrega un texto</h2>

            <input
              type="text"
              value={customText}
              onChange={(event) => {
                setCustomText(event.target.value);
                setSelectedElement("text");
              }}
              className={styles.textInput}
              placeholder="Escribe un texto"
              maxLength={40}
            />

            <div className={styles.colorField}>
              <label htmlFor="text-color">
                Color del texto
              </label>

              <div>
                <input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(event) => {
                    setTextColor(event.target.value);
                    setSelectedElement("text");
                  }}
                />

                <span>{textColor.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <h2>3. Color del producto</h2>

            <div className={styles.productColors}>
              {product.colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  aria-label={`Seleccionar color ${color.name}`}
                  className={
                    productColor === color.value
                      ? styles.selectedColor
                      : undefined
                  }
                  style={{
                    backgroundColor: color.value,
                  }}
                  onClick={() =>
                    setProductColor(color.value)
                  }
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <h2>Elemento seleccionado</h2>

            <div className={styles.selectionStatus}>
              {selectedElement === "image" &&
                "Imagen seleccionada"}

              {selectedElement === "text" &&
                "Texto seleccionado"}

              {!selectedElement &&
                "Selecciona un elemento en el producto"}
            </div>

            <div className={styles.elementControls}>
              <button
                type="button"
                onClick={decreaseSelectedElement}
                disabled={!selectedElement}
                title="Reducir"
              >
                −
              </button>

              <button
                type="button"
                onClick={increaseSelectedElement}
                disabled={!selectedElement}
                title="Aumentar"
              >
                ＋
              </button>

              <button
                type="button"
                onClick={rotateSelectedElement}
                disabled={!selectedElement}
                title="Rotar"
              >
                ↻
              </button>

              <button
                type="button"
                onClick={deleteSelectedElement}
                disabled={!selectedElement}
                title="Eliminar"
                className={styles.deleteButton}
              >
                ×
              </button>
            </div>
          </div>

          <button
            type="button"
            className={styles.resetButton}
            onClick={resetDesign}
          >
            Restablecer diseño
          </button>
        </aside>

        <section className={styles.workspaceSection}>
          <div className={styles.workspaceHeader}>
            <div>
              <span>VISTA PREVIA</span>
              <h2>Organiza tu diseño</h2>
            </div>

            <p>Arrastra los elementos sobre el producto.</p>
          </div>

          <div
            ref={workspaceRef}
            className={styles.workspace}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onPointerLeave={stopDragging}
            onPointerDown={() =>
              setSelectedElement(null)
            }
          >
            <div
              className={styles.workspaceGrid}
              data-exclude-from-capture="true"
            />

            <ProductPreview
              productType={productType}
              productColor={productColor}
              uploadedImage={uploadedImage}
              customText={customText}
              textColor={textColor}
              imagePosition={imagePosition}
              textPosition={textPosition}
              imageScale={imageScale}
              textScale={textScale}
              imageRotation={imageRotation}
              textRotation={textRotation}
              selectedElement={selectedElement}
              onImagePointerDown={(event) =>
                startDragging(
                  event,
                  "image",
                  imagePosition,
                )
              }
              onTextPointerDown={(event) =>
                startDragging(
                  event,
                  "text",
                  textPosition,
                )
              }
            />
          </div>

          <div className={styles.bottomActions}>
            <div>
              <span className={styles.statusDot} />
              Diseño guardado temporalmente en el navegador
            </div>

            <button
              type="button"
              className={styles.continueButton}
              onClick={continueToOrder}
              disabled={isGeneratingPreview}
            >
              {isGeneratingPreview ? (
                "Generando vista previa..."
              ) : (
                <>
                  Continuar pedido
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(Math.max(value, minimum), maximum);
}