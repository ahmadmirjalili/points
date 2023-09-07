import styles from "src/assets/styles/components/Marker.module.css";
import { FC } from "react";
import { MarkerComponent } from "src/@types/components/marker";

const Marker: FC<MarkerComponent.Props> = (props) => {
  return (
    <>
      <div className={styles.marker_position} />
      <button className={styles.submit_button} onClick={props.onClick}>
        اینجا
      </button>
    </>
  );
};

export default Marker;
