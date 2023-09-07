import L from "leaflet";
import styles from "src/assets/styles/components/Map.module.css";

export const markers = {
  userLocation: L.divIcon({
    className: styles.user_location_marker,
  }),
  circleMarker: L.divIcon({
    className: styles.circle_marker,
  }),
};
