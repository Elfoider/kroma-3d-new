import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type HistoryToolbarProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

export default function HistoryToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: HistoryToolbarProps) {
  return (
    <div className={styles.historyToolbar}>
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        title="Deshacer (Ctrl + Z)"
      >
        ↶
      </button>

      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        title="Rehacer (Ctrl + Y)"
      >
        ↷
      </button>
    </div>
  );
}