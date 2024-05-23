import L from "leaflet";
import { useEffect, useId } from "react";
import "leaflet/dist/leaflet.css";
import styles from "src/assets/styles/components/Map.module.css";
import { useMapStore } from "src/services/hooks/zustand/map/useMapStore";

const Map = () => {
  const setMap = useMapStore((state) => state.setMap);
  const maIpd = useId();

  useEffect(() => {
    const map = L.map("map").setView(
      [33.43406047459431, 52.69050235306594],
      6,
      {}
    );

    L.tileLayer(
      "https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution: "",
      }
    ).addTo(map);
    L.tileLayer(
      "https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}{r}.png",
      {
        minZoom: 0,
        maxZoom: 18,
        attribution: "",
      }
    ).addTo(map);

    setMap(map);
  }, []);

  return (
    <>
      <div className={styles.map_container} id="map" key={maIpd} />
    </>
  );
};

export default Map;
