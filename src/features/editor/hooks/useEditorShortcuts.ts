"use client";

import { useEffect, useRef } from "react";

type MovementDirection = "up" | "down" | "left" | "right";

type UseEditorShortcutsOptions = {
  hasSelectedElement: boolean;

  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDeselect: () => void;

  onStartKeyboardMovement: () => void;

  onMoveTransient: (direction: MovementDirection, amount: number) => void;

  onCommitKeyboardMovement: () => void;
  onCancelKeyboardMovement: () => void;

  onActivatePanMode: () => void;
  onDeactivatePanMode: () => void;
};

export function useEditorShortcuts({
  hasSelectedElement,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onDeselect,
  onStartKeyboardMovement,
  onMoveTransient,
  onCommitKeyboardMovement,
  onCancelKeyboardMovement,
  onActivatePanMode,
  onDeactivatePanMode,
}: UseEditorShortcutsOptions) {
  const isMovingWithKeyboardRef = useRef(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingElement(document.activeElement)) {
        return;
      }

      const key = event.key.toLowerCase();
      const hasModifier = event.ctrlKey || event.metaKey;

      if (event.code === "Space" && !event.repeat) {
        event.preventDefault();
        onActivatePanMode();
        return;
      }

      if (hasModifier && key === "z" && !event.shiftKey) {
        event.preventDefault();
        onUndo();
        return;
      }

      if (
        (hasModifier && key === "y") ||
        (hasModifier && event.shiftKey && key === "z")
      ) {
        event.preventDefault();
        onRedo();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        if (isMovingWithKeyboardRef.current) {
          onCancelKeyboardMovement();
          isMovingWithKeyboardRef.current = false;
        }

        onDeselect();
        return;
      }

      if (!hasSelectedElement) {
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        onDelete();
        return;
      }

      if (hasModifier && key === "d") {
        event.preventDefault();
        onDuplicate();
        return;
      }

      const direction = getMovementDirection(event.key);

      if (!direction) {
        return;
      }

      event.preventDefault();

      if (!isMovingWithKeyboardRef.current) {
        onStartKeyboardMovement();
        isMovingWithKeyboardRef.current = true;
      }

      const movementAmount = event.shiftKey ? 5 : 1;

      onMoveTransient(direction, movementAmount);
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault();
        onDeactivatePanMode();
        return;
      }

      const direction = getMovementDirection(event.key);

      if (!direction || !isMovingWithKeyboardRef.current) {
        return;
      }

      onCommitKeyboardMovement();
      isMovingWithKeyboardRef.current = false;
    }

    function handleWindowBlur() {
      onDeactivatePanMode();
      if (!isMovingWithKeyboardRef.current) {
        return;
      }

      onCommitKeyboardMovement();
      isMovingWithKeyboardRef.current = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [
    hasSelectedElement,
    onCancelKeyboardMovement,
    onCommitKeyboardMovement,
    onDelete,
    onDeselect,
    onDuplicate,
    onMoveTransient,
    onRedo,
    onStartKeyboardMovement,
    onUndo,
    onActivatePanMode,
    onDeactivatePanMode,
  ]);
}

function getMovementDirection(key: string): MovementDirection | null {
  if (key === "ArrowUp") {
    return "up";
  }

  if (key === "ArrowDown") {
    return "down";
  }

  if (key === "ArrowLeft") {
    return "left";
  }

  if (key === "ArrowRight") {
    return "right";
  }

  return null;
}

function isTypingElement(element: Element | null) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
}
