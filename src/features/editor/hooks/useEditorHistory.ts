"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type UseEditorHistoryOptions<T> = {
  initialState: T;
  maxHistory?: number;
};

export function useEditorHistory<T>({
  initialState,
  maxHistory = 100,
}: UseEditorHistoryOptions<T>) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  /*
   * Mantiene una referencia inmediata al historial actual.
   * No depende de que React termine una actualización.
   */
  const historyRef = useRef(history);
  historyRef.current = history;

  /*
   * Guarda el documento justo antes de comenzar
   * una acción continua, como arrastrar.
   */
  const transactionStartRef = useRef<T | null>(null);

  const set = useCallback(
    (nextState: T | ((current: T) => T)) => {
      setHistory((currentHistory) => {
        const resolvedState =
          typeof nextState === "function"
            ? (nextState as (current: T) => T)(
                currentHistory.present,
              )
            : nextState;

        if (
          areStatesEqual(
            resolvedState,
            currentHistory.present,
          )
        ) {
          return currentHistory;
        }

        const nextHistory: HistoryState<T> = {
          past: [
            ...currentHistory.past,
            currentHistory.present,
          ].slice(-maxHistory),

          present: resolvedState,
          future: [],
        };

        historyRef.current = nextHistory;

        return nextHistory;
      });
    },
    [maxHistory],
  );

  /*
   * Cambia el documento visible sin registrar cada
   * pequeño movimiento dentro del historial.
   */
  const setTransient = useCallback(
    (nextState: T | ((current: T) => T)) => {
      setHistory((currentHistory) => {
        const resolvedState =
          typeof nextState === "function"
            ? (nextState as (current: T) => T)(
                currentHistory.present,
              )
            : nextState;

        if (
          areStatesEqual(
            resolvedState,
            currentHistory.present,
          )
        ) {
          return currentHistory;
        }

        const nextHistory: HistoryState<T> = {
          ...currentHistory,
          present: resolvedState,
        };

        historyRef.current = nextHistory;

        return nextHistory;
      });
    },
    [],
  );

  /*
   * Se ejecuta sincrónicamente al presionar
   * el elemento. Así el primer movimiento no puede
   * adelantarse al inicio de la transacción.
   */
  const beginTransaction = useCallback(() => {
    if (transactionStartRef.current !== null) {
      return;
    }

    transactionStartRef.current =
      historyRef.current.present;
  }, []);

  /*
   * Convierte todo el arrastre en una sola entrada.
   */
  const commitTransaction = useCallback(() => {
    const transactionStart =
      transactionStartRef.current;

    transactionStartRef.current = null;

    if (transactionStart === null) {
      return;
    }

    setHistory((currentHistory) => {
      if (
        areStatesEqual(
          transactionStart,
          currentHistory.present,
        )
      ) {
        return currentHistory;
      }

      const nextHistory: HistoryState<T> = {
        past: [
          ...currentHistory.past,
          transactionStart,
        ].slice(-maxHistory),

        present: currentHistory.present,
        future: [],
      };

      historyRef.current = nextHistory;

      return nextHistory;
    });
  }, [maxHistory]);

  /*
   * Revierte una operación continua sin registrarla.
   */
  const cancelTransaction = useCallback(() => {
    const transactionStart =
      transactionStartRef.current;

    transactionStartRef.current = null;

    if (transactionStart === null) {
      return;
    }

    setHistory((currentHistory) => {
      const nextHistory: HistoryState<T> = {
        ...currentHistory,
        present: transactionStart,
      };

      historyRef.current = nextHistory;

      return nextHistory;
    });
  }, []);

  const undo = useCallback(() => {
    transactionStartRef.current = null;

    setHistory((currentHistory) => {
      if (currentHistory.past.length === 0) {
        return currentHistory;
      }

      const previousState =
        currentHistory.past[
          currentHistory.past.length - 1
        ];

      const nextHistory: HistoryState<T> = {
        past: currentHistory.past.slice(0, -1),

        present: previousState,

        future: [
          currentHistory.present,
          ...currentHistory.future,
        ],
      };

      historyRef.current = nextHistory;

      return nextHistory;
    });
  }, []);

  const redo = useCallback(() => {
    transactionStartRef.current = null;

    setHistory((currentHistory) => {
      if (currentHistory.future.length === 0) {
        return currentHistory;
      }

      const nextState = currentHistory.future[0];

      const nextHistory: HistoryState<T> = {
        past: [
          ...currentHistory.past,
          currentHistory.present,
        ].slice(-maxHistory),

        present: nextState,
        future: currentHistory.future.slice(1),
      };

      historyRef.current = nextHistory;

      return nextHistory;
    });
  }, [maxHistory]);

  const reset = useCallback((nextState: T) => {
    transactionStartRef.current = null;

    const nextHistory: HistoryState<T> = {
      past: [],
      present: nextState,
      future: [],
    };

    historyRef.current = nextHistory;
    setHistory(nextHistory);
  }, []);

  return {
    state: history.present,

    set,
    setTransient,

    beginTransaction,
    commitTransaction,
    cancelTransaction,

    undo,
    redo,
    reset,

    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,

    isTransactionActive:
      transactionStartRef.current !== null,
  };
}

function areStatesEqual<T>(
  firstState: T,
  secondState: T,
) {
  return (
    JSON.stringify(firstState) ===
    JSON.stringify(secondState)
  );
}