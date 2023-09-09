import L from "leaflet";
import styles from "src/assets/styles/components/Map.module.css";

export const markers = {
  userLocation: L.divIcon({
    className: styles.user_location_marker,
  }),
  navigation: L.divIcon({
    className: `material-symbols-outlined ${styles.navigation_marker}`,
    iconSize: [32, 32],

    html: "navigation",
  }),

  circleMarker: L.divIcon({
    className: styles.circle_marker,
  }),
};
