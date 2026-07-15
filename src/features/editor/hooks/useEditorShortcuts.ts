"use client";

import { useEffect } from "react";

type MovementDirection =
  | "up"
  | "down"
  | "left"
  | "right";

type UseEditorShortcutsOptions = {
  hasSelectedElement: boolean;

  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDeselect: () => void;

  onMove: (
    direction: MovementDirection,
    amount: number,
  ) => void;
};

export function useEditorShortcuts({
  hasSelectedElement,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onDeselect,
  onMove,
}: UseEditorShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingElement(document.activeElement)) {
        return;
      }

      const key = event.key.toLowerCase();
      const hasModifier = event.ctrlKey || event.metaKey;

      if (
        hasModifier &&
        key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        onUndo();
        return;
      }

      if (
        (hasModifier && key === "y") ||
        (hasModifier &&
          event.shiftKey &&
          key === "z")
      ) {
        event.preventDefault();
        onRedo();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onDeselect();
        return;
      }

      if (!hasSelectedElement) {
        return;
      }

      if (
        event.key === "Delete" ||
        event.key === "Backspace"
      ) {
        event.preventDefault();
        onDelete();
        return;
      }

      if (hasModifier && key === "d") {
        event.preventDefault();
        onDuplicate();
        return;
      }

      const movementAmount = event.shiftKey ? 5 : 1;

      if (event.key === "ArrowUp") {
        event.preventDefault();
        onMove("up", movementAmount);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        onMove("down", movementAmount);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onMove("left", movementAmount);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onMove("right", movementAmount);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    hasSelectedElement,
    onDelete,
    onDeselect,
    onDuplicate,
    onMove,
    onRedo,
    onUndo,
  ]);
}

function isTypingElement(
  element: Element | null,
) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLElement &&
      element.isContentEditable
  );
}