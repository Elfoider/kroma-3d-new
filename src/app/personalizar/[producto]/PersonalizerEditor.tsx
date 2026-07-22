"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { useState } from "react";

import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorWorkspace from "@/components/editor/EditorWorkspace";
import { useEditorShortcuts } from "@/features/editor/hooks/useEditorShortcuts";
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

  useEditorShortcuts({
    hasSelectedElement: Boolean(editor.selectedElement),

    onUndo: editor.undo,
    onRedo: editor.redo,

    onDelete: editor.deleteSelectedElement,
    onDuplicate: editor.duplicateSelectedElement,
    onDeselect: editor.deselectElement,

    onStartKeyboardMovement: editor.startKeyboardMovement,

    onMoveTransient: editor.moveSelectedElementTransient,

    onCommitKeyboardMovement: editor.commitKeyboardMovement,

    onCancelKeyboardMovement: editor.cancelKeyboardMovement,

    onActivatePanMode:
  editor.activatePanMode,

onDeactivatePanMode:
  editor.deactivatePanMode,
  });

  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  async function continueToOrder() {
    const workspaceElement = editor.workspaceRef.current;

    if (!workspaceElement) {
      alert("No se pudo encontrar la vista previa.");
      return;
    }

    const previousZoom = editor.zoom;
    try {
      setIsGeneratingPreview(true);

      editor.fitView();
      editor.deselectElement(); 

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 250);
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
        customText: firstText?.type === "text" ? firstText.text : "",
        textColor: firstText?.type === "text" ? firstText.color : "#000000",
      };

      sessionStorage.setItem(
        "kroma3d-current-design",
        JSON.stringify(savedDesign),
      );

      router.push("/pedido");
    } catch (error) {
      console.error(error);

      alert("No se pudo generar la imagen del diseño.");
    } finally {
      editor.setZoom(previousZoom);
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
          elements={editor.elements}
          selectedElement={editor.selectedElement}
          selectedElementId={editor.selectedElementId}
          onImageUpload={editor.handleImageUpload}
          onAddText={editor.addTextElement}
          onTextChange={editor.updateSelectedText}
          onTextColorChange={editor.updateSelectedTextColor}
          onProductColorChange={editor.setProductColor}
          onDecreaseElement={editor.decreaseSelectedElement}
          onIncreaseElement={editor.increaseSelectedElement}
          onRotateElement={editor.rotateSelectedElement}
          onDuplicateElement={editor.duplicateSelectedElement}
          onToggleSelectedElementLock={editor.toggleSelectedElementLock}
          onDeleteSelectedElement={editor.deleteSelectedElement}
          onSelectElement={editor.selectElement}
          onToggleElementVisibility={editor.toggleElementVisibility}
          onToggleElementLock={editor.toggleElementLock}
          onMoveElementUp={editor.moveElementUp}
          onMoveElementDown={editor.moveElementDown}
          onBringElementToFront={editor.bringElementToFront}
          onSendElementToBack={editor.sendElementToBack}
          onDeleteElementById={editor.deleteElementById}
          onResetDesign={editor.resetDesign}
          onAlignLeft={editor.alignSelectedElementLeft}
          onAlignHorizontalCenter={editor.alignSelectedElementHorizontalCenter}
          onAlignRight={editor.alignSelectedElementRight}
          onAlignTop={editor.alignSelectedElementTop}
          onAlignVerticalCenter={editor.alignSelectedElementVerticalCenter}
          onAlignBottom={editor.alignSelectedElementBottom}
          onAlignExactCenter={editor.alignSelectedElementExactCenter}
        />

        <EditorWorkspace
          workspaceRef={editor.workspaceRef}
          productType={productType}
          productColor={editor.productColor}
          elements={editor.elements}
          selectedElementId={editor.selectedElementId}
          activeGuides={editor.activeGuides}
          zoom={editor.zoom}
          canZoomIn={editor.canZoomIn}
          canZoomOut={editor.canZoomOut}
          isGeneratingPreview={isGeneratingPreview}
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          onUndo={editor.undo}
          onRedo={editor.redo}
          onZoomIn={editor.zoomIn}
          onZoomOut={editor.zoomOut}
          onZoomChange={editor.setZoom}
          onFitView={editor.fitView}
          onWorkspacePointerMove={editor.handlePointerMove}
          onStopDragging={editor.stopDragging}
          onDeselectElement={editor.deselectElement}
          onElementPointerDown={editor.startDragging}
          onScalePointerDown={editor.startScaling}
          onRotatePointerDown={editor.startRotating}
          onContinueOrder={continueToOrder}
          panPosition={editor.panPosition}
isPanning={editor.isPanning}
isPanModeActive={editor.isPanModeActive}
onStartPanning={editor.startPanning}
        />
      </section>
    </main>
  );
}
