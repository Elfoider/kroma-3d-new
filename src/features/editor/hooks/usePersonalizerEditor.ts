"use client";

import {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";

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

  const defaultProductColor =
    product.colors[0]?.value ?? "#ffffff";

  const [productColor, setProductColor] = useState(
    defaultProductColor,
  );

  const [elements, setElements] = useState<EditorElement[]>([
    createTextElement("Tu diseño", 1),
  ]);

  const [selectedElementId, setSelectedElementId] = useState<
    string | null
  >(elements[0]?.id ?? null);

  const [dragState, setDragState] =
    useState<DragState | null>(null);

  const selectedElement = useMemo(
    () =>
      elements.find(
        (element) => element.id === selectedElementId,
      ) ?? null,
    [elements, selectedElementId],
  );

  function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
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

        setElements((current) => {
          const imageElement = createImageElement(
            reader.result,
            file.name,
            getNextZIndex(current),
          );

          setSelectedElementId(imageElement.id);

          return [...current, imageElement];
        });
      };

      reader.onerror = () => {
        alert(`No se pudo cargar la imagen ${file.name}.`);
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  }

  function addTextElement() {
    setElements((current) => {
      const textElement = createTextElement(
        "Nuevo texto",
        getNextZIndex(current),
      );

      setSelectedElementId(textElement.id);

      return [...current, textElement];
    });
  }

  function updateSelectedElement(
    updates: Partial<EditorElement>,
  ) {
    if (!selectedElementId) {
      return;
    }

    setElements((current) =>
      current.map((element) => {
        if (element.id !== selectedElementId) {
          return element;
        }

        return {
          ...element,
          ...updates,
        } as EditorElement;
      }),
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
    const element = elements.find(
      (item) => item.id === elementId,
    );

    if (!element || element.locked) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    setSelectedElementId(elementId);
    event.currentTarget.setPointerCapture(event.pointerId);

    setDragState({
      elementId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startElementX: element.position.x,
      startElementY: element.position.y,
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
      x: clamp(dragState.startElementX + movementX, 3, 97),
      y: clamp(dragState.startElementY + movementY, 3, 97),
    };

    setElements((current) =>
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
    setDragState(null);
  }

  function increaseSelectedElement() {
    if (!selectedElement) {
      return;
    }

    updateSelectedElement({
      scale: clamp(selectedElement.scale + 0.1, 0.2, 4),
    });
  }

  function decreaseSelectedElement() {
    if (!selectedElement) {
      return;
    }

    updateSelectedElement({
      scale: clamp(selectedElement.scale - 0.1, 0.2, 4),
    });
  }

  function rotateSelectedElement() {
    if (!selectedElement) {
      return;
    }

    updateSelectedElement({
      rotation: normalizeRotation(
        selectedElement.rotation + 15,
      ),
    });
  }

  function deleteSelectedElement() {
    if (!selectedElementId) {
      return;
    }

    setElements((current) =>
      current.filter(
        (element) => element.id !== selectedElementId,
      ),
    );

    setSelectedElementId(null);
  }

  function duplicateSelectedElement() {
    if (!selectedElement) {
      return;
    }

    setElements((current) => {
      const duplicate: EditorElement = {
        ...selectedElement,
        id: crypto.randomUUID(),
        position: {
          x: clamp(selectedElement.position.x + 5, 3, 97),
          y: clamp(selectedElement.position.y + 5, 3, 97),
        },
        zIndex: getNextZIndex(current),
      };

      setSelectedElementId(duplicate.id);

      return [...current, duplicate];
    });
  }

  function toggleSelectedElementLock() {
    if (!selectedElement) {
      return;
    }

    updateSelectedElement({
      locked: !selectedElement.locked,
    });
  }

  function resetDesign() {
    const initialText = createTextElement("Tu diseño", 1);

    setElements([initialText]);
    setSelectedElementId(initialText.id);
    setProductColor(defaultProductColor);
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
    startDragging,

    increaseSelectedElement,
    decreaseSelectedElement,
    rotateSelectedElement,
    deleteSelectedElement,
    duplicateSelectedElement,
    toggleSelectedElementLock,

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
    position: INITIAL_IMAGE_POSITION,
    scale: 1,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex,
  };
}

function createTextElement(
  text: string,
  zIndex: number,
): TextEditorElement {
  return {
    id: crypto.randomUUID(),
    type: "text",
    text,
    color: "#7b2eff",
    fontSize: 22,
    fontFamily: "var(--font-orbitron)",
    position: INITIAL_TEXT_POSITION,
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

  return Math.max(
    ...elements.map((element) => element.zIndex),
  ) + 1;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(Math.max(value, minimum), maximum);
}

function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360;
}