import styles from "src/assets/styles/components/Marker.module.css";
import { FC } from "react";
import { MarkerComponent } from "src/@types/components/marker";

const Marker: FC<MarkerComponent.Props> = (props) => {
  return (
    <>
      <div className={styles.marker_position} />
      <div className={styles.button_container}>
        <button className={styles.submit_button} onClick={props.submitHandler}>
          اینجا
        </button>
        <button className={styles.cancel_button} onClick={props.cancelHandler}>
          لغو
        </button>
      </div>
    </>
  );
};

export default Marker;
