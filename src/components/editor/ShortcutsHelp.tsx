import styles from "../../app/personalizar/[producto]/personalizer.module.css";

export default function ShortcutsHelp() {
  return (
    <details className={styles.shortcutsHelp}>
      <summary>Atajos del editor</summary>

      <div className={styles.shortcutsList}>
        <Shortcut keys="Ctrl + Z" description="Deshacer" />

        <Shortcut keys="Ctrl + Y" description="Rehacer" />

        <Shortcut keys="Ctrl + D" description="Duplicar elemento" />

        <Shortcut keys="Delete" description="Eliminar elemento" />

        <Shortcut keys="Esc" description="Deseleccionar" />

        <Shortcut keys="Flechas" description="Mover 1 unidad" />

        <Shortcut keys="Shift + Flechas" description="Mover 5 unidades" />

        <Shortcut keys="Espacio + arrastrar" description="Desplazar vista" />
      </div>
    </details>
  );
}

type ShortcutProps = {
  keys: string;
  description: string;
};

function Shortcut({ keys, description }: ShortcutProps) {
  return (
    <div>
      <kbd>{keys}</kbd>
      <span>{description}</span>
    </div>
  );
}
