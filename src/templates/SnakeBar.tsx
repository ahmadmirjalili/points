import styles from "src/assets/styles/templates/SnakeBar.module.css";
import { createPortal } from "react-dom";
import { useSnakeBarStore } from "src/services/hooks/zustand/snakeBar/useSnakeBarStore";
import { useEffect } from "react";

const SnakeBar = () => {
  const { setSnakeBar, snakeBar } = useSnakeBarStore((state) => state);
  let getSetTimeOut: number = 0;

  const closeSnakeBar = () => {
    setSnakeBar({ open: false, text: "", type: "warning" });
    clearTimeout(getSetTimeOut);
  };

  useEffect(() => {
    if (snakeBar.open) getSetTimeOut = setTimeout(closeSnakeBar, 3000);
  }, [snakeBar.open]);

  if (!snakeBar.open) return null;

  return createPortal(
    <>
      <div
        className={`${styles.snackbar}  ${styles[snakeBar.type]} ${
          snakeBar.open ? styles.show : ""
        }`}
        onClick={closeSnakeBar}
      >
        <span className="material-symbols-outlined">
          {snakeBar.type === "error"
            ? "error"
            : snakeBar.type === "success"
            ? "check_circle"
            : snakeBar.type === "warning"
            ? "warning"
            : ""}
        </span>
        {snakeBar.text}
      </div>
    </>,
    document.body
  );
};

export default SnakeBar;
