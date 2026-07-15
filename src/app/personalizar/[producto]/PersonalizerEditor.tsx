"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { useState } from "react";

import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorWorkspace from "@/components/editor/EditorWorkspace";

import { PRODUCTS } from "@/constants/products";
import { usePersonalizerEditor } from "@/features/editor/hooks/usePersonalizerEditor";

import type { ProductType } from "@/types/product";

import styles from "./personalizer.module.css";

type PersonalizerEditorProps = {
  productType: ProductType;
};

export default function PersonalizerEditor({
  productType,
}: PersonalizerEditorProps) {
  const router = useRouter();
  const product = PRODUCTS[productType];

  const editor = usePersonalizerEditor({
    product,
  });

  const [isGeneratingPreview, setIsGeneratingPreview] =
    useState(false);

  async function continueToOrder() {
    const workspaceElement = editor.workspaceRef.current;

    if (!workspaceElement) {
      alert("No se pudo encontrar la vista previa.");
      return;
    }

    try {
      setIsGeneratingPreview(true);
      editor.deselectElement();

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

      const firstText = editor.elements.find(
        (element) => element.type === "text",
      );

      const savedDesign = {
        productType,
        productName: product.name,
        productColor: editor.productColor,
        elements: editor.elements,
        previewImage,
        createdAt: new Date().toISOString(),

        // Compatibilidad temporal con el formulario actual.
        customText:
          firstText?.type === "text" ? firstText.text : "",
        textColor:
          firstText?.type === "text"
            ? firstText.color
            : "#000000",
      };

      sessionStorage.setItem(
        "kroma3d-current-design",
        JSON.stringify(savedDesign),
      );

      router.push("/pedido");
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo generar la imagen del diseño.",
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
        <EditorSidebar
          product={product}
          productColor={editor.productColor}
          selectedElement={editor.selectedElement}
          onImageUpload={editor.handleImageUpload}
          onAddText={editor.addTextElement}
          onTextChange={editor.updateSelectedText}
          onTextColorChange={
            editor.updateSelectedTextColor
          }
          onProductColorChange={editor.setProductColor}
          onDecreaseElement={
            editor.decreaseSelectedElement
          }
          onIncreaseElement={
            editor.increaseSelectedElement
          }
          onRotateElement={editor.rotateSelectedElement}
          onDuplicateElement={
            editor.duplicateSelectedElement
          }
          onToggleElementLock={
            editor.toggleSelectedElementLock
          }
          onDeleteElement={editor.deleteSelectedElement}
          onResetDesign={editor.resetDesign}
        />

        <EditorWorkspace
          workspaceRef={editor.workspaceRef}
          productType={productType}
          productColor={editor.productColor}
          elements={editor.elements}
          selectedElementId={editor.selectedElementId}
          isGeneratingPreview={isGeneratingPreview}
          onWorkspacePointerMove={
            editor.handlePointerMove
          }
          onStopDragging={editor.stopDragging}
          onDeselectElement={editor.deselectElement}
          onElementPointerDown={editor.startDragging}
          onContinueOrder={continueToOrder}
        />
      </section>
    </main>
  );
}