"use client";

import {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { useEditorHistory } from "./useEditorHistory";

import type {
  DragState,
  EditorElement,
  ImageEditorElement,
  Position,
  TextEditorElement,
} from "@/types/editor";

import type { ProductDefinition } from "@/types/product";

type UsePersonalizerEditorOptions = {
  product: ProductDefinition;
};

type EditorDocument = {
  productColor: string;
  elements: EditorElement[];
};

const INITIAL_IMAGE_POSITION: Position = {
  x: 50,
  y: 42,
};

const INITIAL_TEXT_POSITION: Position = {
  x: 50,
  y: 68,
};

export function usePersonalizerEditor({
  product,
}: UsePersonalizerEditorOptions) {
  const workspaceRef = useRef<HTMLDivElement>(null);

  const defaultProductColor = product.colors[0]?.value ?? "#ffffff";

  const initialText = useMemo(() => createTextElement("Tu diseño", 1), []);

  const history = useEditorHistory<EditorDocument>({
    initialState: {
      productColor: defaultProductColor,
      elements: [initialText],
    },
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    initialText.id,
  );

  const [dragState, setDragState] = useState<DragState | null>(null);

  const elements = history.state.elements;
  const productColor = history.state.productColor;

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  function setElements(
    updater: EditorElement[] | ((current: EditorElement[]) => EditorElement[]),
  ) {
    history.set((currentDocument) => ({
      ...currentDocument,

      elements:
        typeof updater === "function"
          ? updater(currentDocument.elements)
          : updater,
    }));
  }

  function setElementsTransient(
    updater: EditorElement[] | ((current: EditorElement[]) => EditorElement[]),
  ) {
    history.setTransient((currentDocument) => ({
      ...currentDocument,

      elements:
        typeof updater === "function"
          ? updater(currentDocument.elements)
          : updater,
    }));
  }

  function setProductColor(value: string) {
    history.set((currentDocument) => ({
      ...currentDocument,
      productColor: value,
    }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") {
          return;
        }

        const imageElement = createImageElement(
          reader.result,
          file.name,
          getNextZIndex(elements),
        );

        setElements((current) => [...current, imageElement]);

        setSelectedElementId(imageElement.id);
      };

      reader.onerror = () => {
        alert(`No se pudo cargar la imagen ${file.name}.`);
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  }

  function addTextElement() {
    const textElement = createTextElement(
      "Nuevo texto",
      getNextZIndex(elements),
    );

    setElements((current) => [...current, textElement]);

    setSelectedElementId(textElement.id);
  }

  function updateSelectedElement(updates: Partial<EditorElement>) {
    if (!selectedElementId) {
      return;
    }

    setElements((current) =>
      current.map((element) =>
        element.id === selectedElementId
          ? ({
              ...element,
              ...updates,
            } as EditorElement)
          : element,
      ),
    );
  }

  function updateElementById(
    elementId: string,
    updates: Partial<EditorElement>,
  ) {
    setElements((current) =>
      current.map((element) =>
        element.id === elementId
          ? ({
              ...element,
              ...updates,
            } as EditorElement)
          : element,
      ),
    );
  }

  function updateSelectedText(value: string) {
    if (selectedElement?.type !== "text") {
      return;
    }

    updateSelectedElement({
      text: value,
    } as Partial<TextEditorElement>);
  }

  function updateSelectedTextColor(value: string) {
    if (selectedElement?.type !== "text") {
      return;
    }

    updateSelectedElement({
      color: value,
    } as Partial<TextEditorElement>);
  }

  function selectElement(elementId: string) {
    setSelectedElementId(elementId);
  }

  function deselectElement() {
    setSelectedElementId(null);
  }

  function startDragging(
    event: ReactPointerEvent<HTMLDivElement>,
    elementId: string,
  ) {
    const element = elements.find((item) => item.id === elementId);

    if (!element || element.locked || !element.visible) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    setSelectedElementId(elementId);

    event.currentTarget.setPointerCapture(event.pointerId);

    /*
     * Desde este momento todas las actualizaciones
     * del movimiento serán temporales.
     */
    history.beginTransaction();

    setDragState({
      elementId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startElementX: element.position.x,
      startElementY: element.position.y,
    });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragState || !workspaceRef.current) {
      return;
    }

    const workspace = workspaceRef.current.getBoundingClientRect();

    const movementX =
      ((event.clientX - dragState.startPointerX) / workspace.width) * 100;

    const movementY =
      ((event.clientY - dragState.startPointerY) / workspace.height) * 100;

    const nextPosition = {
      x: clamp(dragState.startElementX + movementX, 3, 97),

      y: clamp(dragState.startElementY + movementY, 3, 97),
    };

    /*
     * No creamos un paso nuevo en el historial
     * durante cada movimiento del mouse.
     */
    setElementsTransient((current) =>
      current.map((element) =>
        element.id === dragState.elementId
          ? {
              ...element,
              position: nextPosition,
            }
          : element,
      ),
    );
  }

  function stopDragging() {
    if (!dragState) {
      return;
    }

    /*
     * Todo el arrastre se guarda como una
     * sola acción.
     */
    history.commitTransaction();
    setDragState(null);
  }

  function cancelDragging() {
    if (!dragState) {
      return;
    }

    history.cancelTransaction();
    setDragState(null);
  }

  function increaseSelectedElement() {
    if (!selectedElement || selectedElement.locked) {
      return;
    }

    updateSelectedElement({
      scale: clamp(selectedElement.scale + 0.1, 0.2, 4),
    });
  }

  function decreaseSelectedElement() {
    if (!selectedElement || selectedElement.locked) {
      return;
    }

    updateSelectedElement({
      scale: clamp(selectedElement.scale - 0.1, 0.2, 4),
    });
  }

  function rotateSelectedElement() {
    if (!selectedElement || selectedElement.locked) {
      return;
    }

    updateSelectedElement({
      rotation: normalizeRotation(selectedElement.rotation + 15),
    });
  }

  function deleteSelectedElement() {
    if (!selectedElementId) {
      return;
    }

    deleteElementById(selectedElementId);
  }

  function deleteElementById(elementId: string) {
    setElements((current) =>
      normalizeZIndexes(current.filter((element) => element.id !== elementId)),
    );

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }

  function duplicateSelectedElement() {
    if (!selectedElement) {
      return;
    }

    const duplicate: EditorElement = {
      ...selectedElement,

      id: crypto.randomUUID(),

      position: {
        x: clamp(selectedElement.position.x + 5, 3, 97),

        y: clamp(selectedElement.position.y + 5, 3, 97),
      },

      zIndex: getNextZIndex(elements),
    };

    setElements((current) => [...current, duplicate]);

    setSelectedElementId(duplicate.id);
  }

  function toggleSelectedElementLock() {
    if (!selectedElement) {
      return;
    }

    toggleElementLock(selectedElement.id);
  }

  function toggleElementLock(elementId: string) {
    const element = elements.find((item) => item.id === elementId);

    if (!element) {
      return;
    }

    updateElementById(elementId, {
      locked: !element.locked,
    });
  }

  function toggleElementVisibility(elementId: string) {
    const element = elements.find((item) => item.id === elementId);

    if (!element) {
      return;
    }

    updateElementById(elementId, {
      visible: !element.visible,
    });

    if (selectedElementId === elementId && element.visible) {
      setSelectedElementId(null);
    }
  }

  function moveElementUp(elementId: string) {
    setElements((current) => {
      const ordered = [...current].sort(
        (first, second) => first.zIndex - second.zIndex,
      );

      const index = ordered.findIndex((element) => element.id === elementId);

      if (index < 0 || index === ordered.length - 1) {
        return current;
      }

      [ordered[index], ordered[index + 1]] = [
        ordered[index + 1],
        ordered[index],
      ];

      return normalizeZIndexes(ordered);
    });
  }

  function moveElementDown(elementId: string) {
    setElements((current) => {
      const ordered = [...current].sort(
        (first, second) => first.zIndex - second.zIndex,
      );

      const index = ordered.findIndex((element) => element.id === elementId);

      if (index <= 0) {
        return current;
      }

      [ordered[index], ordered[index - 1]] = [
        ordered[index - 1],
        ordered[index],
      ];

      return normalizeZIndexes(ordered);
    });
  }

  function bringElementToFront(elementId: string) {
    setElements((current) => {
      const selected = current.find((element) => element.id === elementId);

      if (!selected) {
        return current;
      }

      const others = current.filter((element) => element.id !== elementId);

      return normalizeZIndexes([...others, selected]);
    });
  }

  function sendElementToBack(elementId: string) {
    setElements((current) => {
      const selected = current.find((element) => element.id === elementId);

      if (!selected) {
        return current;
      }

      const others = current.filter((element) => element.id !== elementId);

      return normalizeZIndexes([selected, ...others]);
    });
  }

  function startKeyboardMovement() {
    if (!selectedElement || selectedElement.locked) {
      return;
    }

    history.beginTransaction();
  }

  function moveSelectedElementTransient(
    direction: "up" | "down" | "left" | "right",
    amount = 1,
  ) {
    const currentSelectedElement = history.state.elements.find(
      (element) => element.id === selectedElementId,
    );

    if (!currentSelectedElement || currentSelectedElement.locked) {
      return;
    }

    const movement = {
      x: 0,
      y: 0,
    };

    if (direction === "up") {
      movement.y = -amount;
    }

    if (direction === "down") {
      movement.y = amount;
    }

    if (direction === "left") {
      movement.x = -amount;
    }

    if (direction === "right") {
      movement.x = amount;
    }

    updateSelectedElementTransient({
      position: {
        x: clamp(currentSelectedElement.position.x + movement.x, 3, 97),

        y: clamp(currentSelectedElement.position.y + movement.y, 3, 97),
      },
    });
  }

  function commitKeyboardMovement() {
    history.commitTransaction();
  }

  function cancelKeyboardMovement() {
    history.cancelTransaction();
  }

  function undo() {
    history.undo();
    setSelectedElementId(null);
    setDragState(null);
  }

  function redo() {
    history.redo();
    setSelectedElementId(null);
    setDragState(null);
  }

  function resetDesign() {
    const newText = createTextElement("Tu diseño", 1);

    history.reset({
      productColor: defaultProductColor,
      elements: [newText],
    });

    setSelectedElementId(newText.id);
    setDragState(null);
  }

  return {
    workspaceRef,

    productColor,
    setProductColor,

    elements,
    selectedElement,
    selectedElementId,

    handleImageUpload,
    addTextElement,

    updateSelectedText,
    updateSelectedTextColor,

    selectElement,
    deselectElement,

    handlePointerMove,
    stopDragging,
    cancelDragging,
    startDragging,

    increaseSelectedElement,
    decreaseSelectedElement,
    rotateSelectedElement,

    startKeyboardMovement,
    moveSelectedElementTransient,
    commitKeyboardMovement,
    cancelKeyboardMovement,

    deleteSelectedElement,
    deleteElementById,
    duplicateSelectedElement,

    toggleSelectedElementLock,
    toggleElementLock,
    toggleElementVisibility,

    moveElementUp,
    moveElementDown,
    bringElementToFront,
    sendElementToBack,

    undo,
    redo,

    canUndo: history.canUndo,
    canRedo: history.canRedo,

    resetDesign,
  };
}

function createImageElement(
  src: string,
  name: string,
  zIndex: number,
): ImageEditorElement {
  return {
    id: crypto.randomUUID(),
    type: "image",
    src,
    name,

    position: {
      ...INITIAL_IMAGE_POSITION,
    },

    scale: 1,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex,
  };
}

function createTextElement(text: string, zIndex: number): TextEditorElement {
  return {
    id: crypto.randomUUID(),
    type: "text",
    text,
    color: "#7b2eff",
    fontSize: 22,
    fontFamily: "var(--font-orbitron)",

    position: {
      ...INITIAL_TEXT_POSITION,
    },

    scale: 1,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex,
  };
}

function getNextZIndex(elements: EditorElement[]) {
  if (elements.length === 0) {
    return 1;
  }

  return Math.max(...elements.map((element) => element.zIndex)) + 1;
}

function normalizeZIndexes(elements: EditorElement[]): EditorElement[] {
  return elements.map((element, index) => ({
    ...element,
    zIndex: index + 1,
  }));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360;
}

function updateSelectedElementTransient(updates: Partial<EditorElement>) {
  if (!selectedElementId) {
    return;
  }

  setElementsTransient((current) =>
    current.map((element) =>
      element.id === selectedElementId
        ? ({
            ...element,
            ...updates,
          } as EditorElement)
        : element,
    ),
  );
}
