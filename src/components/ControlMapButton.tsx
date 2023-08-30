import styles from "src/assets/styles/components/ControlMapButton.module.css";
import { useMapStore } from "src/services/hooks/zustand/map/useMapStore";
import L from "leaflet";
import { markers } from "src/services/utils/map/markers";

const ControlMapButton = () => {
  const map = useMapStore((state) => state.map);
  let setMarker = false;

  const findUserLocationHandler = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getUserLocation);
    } else {
    }
  };

  const getUserLocation: PositionCallback = (result) => {
    const { latitude, longitude } = result.coords;
    if (map && longitude && latitude && !setMarker) {
      map.flyTo({ lat: latitude, lng: longitude }, 10);
      L.marker([latitude, longitude], { icon: markers.userLocation }).addTo(
        map
      );
      setMarker = true;
    }
  };
  return (
    <>
      <button
        className={styles.get_user_location}
        onClick={findUserLocationHandler}
      >
        !منو پیدا کن{" "}
      </button>
    </>
  );
};

export default ControlMapButton;
