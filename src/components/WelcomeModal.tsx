import { useEffect, useState } from "react";
import point from "src/assets/images/point.webp";
import styles from "src/assets/styles/components/WelcomeModal.module.css";

const WelcomeModal = () => {
  const [open, setOpen] = useState<"open" | "close" | "closing">("open");

  useEffect(() => {
    if (open === "closing") {
      setTimeout(() => {
        setOpen("close");
      }, 1000);
    }
  }, [open]);

  const closeModal = () => {
    setOpen("closing");
  };

  if (open === "close") return <></>;

  return (
    <div
      className={`${styles.modal} ${
        open === "closing" ? styles.modal_close : ""
      } `}
    >
      <div className={styles.modal_container}>
        <img src={point} />
        <h1>سلام، خوش آمدید 👋</h1>
        <p className={styles.point_info}>
          "نقطه ها" پلتفرمی برای ارائه خدمات نقشه و رفع نیاز خواسته های کاربران
          است.
        </p>
        <p className={styles.beta_info}>
          <span>توجه:</span> نقطه در حالا بتا می باشد
        </p>
        <p className={styles.author_info}>
          {" "}
          ساخته شده با ❤️ توسط{" "}
          <a href="https://smirjalili.ir" target="_blank">
            احمد
          </a>
        </p>
        <button onClick={closeModal} className={styles.button}>
          متوجه شدم
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
