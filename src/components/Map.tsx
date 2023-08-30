import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import styles from "src/assets/styles/components/Map.module.css";
import { markers } from "src/services/utils/map/markers";

const Map = () => {
  useEffect(() => {
    let map = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }, []);

  return (
    <>
      <div
        className={styles.map_container}
        id="map"
        key={new Date().getTime()}
      />
    </>
  );
};

export default Map;
