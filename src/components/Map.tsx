import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import styles from "src/assets/styles/components/Map.module.css";
import { useMapStore } from "src/services/hooks/zustand/map/useMapStore";

const Map = () => {
  const setMap = useMapStore((state) => state.setMap);

  useEffect(() => {
    const map = L.map("map").setView(
      [33.43406047459431, 52.69050235306594],
      6,
      {}
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/stamen_terrain_lines/{z}/{x}/{y}{r}.{ext}",
      {
        minZoom: 0,
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        //@ts-ignore
        ext: "png",
      }
    ).addTo(map);

    setMap(map);
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
