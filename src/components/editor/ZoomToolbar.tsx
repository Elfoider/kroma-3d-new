import styles from "../../app/personalizar/[producto]/personalizer.module.css";

type ZoomToolbarProps = {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;

  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange: (zoom: number) => void;
  onFitView: () => void;
};

const ZOOM_OPTIONS = [25, 50, 75, 100, 125, 150, 175, 200];

export default function ZoomToolbar({
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  onFitView,
}: ZoomToolbarProps) {
  const normalizedZoom = normalizeZoom(zoom);

  return (
    <div
      className={styles.zoomToolbar}
      data-exclude-from-capture="true"
    >
      <button
        type="button"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        title="Alejar"
        aria-label="Alejar vista"
      >
        −
      </button>

      <div className={styles.zoomStatus}>
        <strong>{normalizedZoom}%</strong>

        <select
          value={normalizedZoom}
          onChange={(event) => {
            const nextZoom = Number.parseInt(
              event.target.value,
              10,
            );

            if (Number.isFinite(nextZoom)) {
              onZoomChange(nextZoom);
            }
          }}
          aria-label="Nivel de zoom"
        >
          {ZOOM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}%
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        title="Acercar"
        aria-label="Acercar vista"
      >
        ＋
      </button>

      <button
        type="button"
        className={styles.fitViewButton}
        onClick={onFitView}
        title="Ajustar producto al área"
      >
        Ajustar
      </button>
    </div>
  );
}

function normalizeZoom(value: number) {
  if (!Number.isFinite(value)) {
    return 100;
  }

  return Math.min(200, Math.max(25, Math.round(value)));
}