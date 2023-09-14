import styles from "src/assets/styles/templates/SnakeBar.module.css";
import { createPortal } from "react-dom";
import { useSnakeBarStore } from "src/services/hooks/zustand/snakeBar/useSnakeBarStore";
import { useEffect, useState } from "react";

const SnakeBar = () => {
  const { setSnakeBar, snakeBar } = useSnakeBarStore((state) => state);
  const [getSetTimeOut, setGetSetTimeOut] = useState(0);

  const closeSnakeBar = () => {
    clearTimeout(getSetTimeOut);
    setSnakeBar({ open: false, text: "", type: "warning" });
    setGetSetTimeOut(0);
  };

  useEffect(() => {
    if (snakeBar.open) {
      setGetSetTimeOut(setTimeout(closeSnakeBar, 5000));
    }
  }, [snakeBar.open]);

  if (!snakeBar.open && getSetTimeOut === 0) return null;

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
