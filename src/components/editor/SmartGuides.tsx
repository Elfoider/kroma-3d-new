import type { ActiveGuides } from "@/types/editor";

import styles from "./editor-components.module.css";

type SmartGuidesProps = {
  guides?: ActiveGuides;
};

const DEFAULT_GUIDES: ActiveGuides = {
  vertical: false,
  horizontal: false,
};

export default function SmartGuides({
  guides = DEFAULT_GUIDES,
}: SmartGuidesProps) {
  if (!guides.vertical && !guides.horizontal) {
    return null;
  }

  return (
    <div
      className={styles.smartGuides}
      data-exclude-from-capture="true"
      aria-hidden="true"
    >
      {guides.vertical && (
        <div className={styles.verticalGuide} />
      )}

      {guides.horizontal && (
        <div className={styles.horizontalGuide} />
      )}

      {guides.vertical && guides.horizontal && (
        <div className={styles.guideCenterPoint} />
      )}
    </div>
  );
}