import styles from "src/assets/styles/components/ControlMapButton.module.css";
import { useMapStore } from "src/services/hooks/zustand/map/useMapStore";
import L from "leaflet";
import { markers } from "src/services/utils/map/markers";
import { useSnakeBarStore } from "src/services/hooks/zustand/snakeBar/useSnakeBarStore";

const ControlMapButton = () => {
  const map = useMapStore((state) => state.map);
  const setSnakeBar = useSnakeBarStore((state) => state.setSnakeBar);
  let setMarker = false;

  const findUserLocationHandler = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getUserLocation,
        getLocationErrorHandler
      );
    } else {
      setSnakeBar({
        open: true,
        text: "مرورگر شما از این قابلیت را ندارد",
        type: "error",
      });
    }
  };

  const getUserLocation: PositionCallback = (result) => {
    const { latitude, longitude } = result.coords;
    if (map && longitude && latitude) {
      map.flyTo({ lat: latitude, lng: longitude }, 17);
      !setMarker &&
        L.marker([latitude, longitude], { icon: markers.userLocation }).addTo(
          map
        );
      setMarker = true;
    }
  };

  const getLocationErrorHandler: PositionErrorCallback = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setSnakeBar({
          open: true,
          text: "لطفا دسترسی موقعیت مکانی را به سایت بدهید",
          type: "error",
        });
        break;
      case error.POSITION_UNAVAILABLE:
        setSnakeBar({
          open: true,
          text: "اوخ موقعیت مکانی در دسترس نیست",
          type: "error",
        });
        break;
      case error.TIMEOUT:
        setSnakeBar({
          open: true,
          text: "لطفا دوباره تلاش کنید",
          type: "error",
        });
        break;
      default:
        setSnakeBar({
          open: true,
          text: "لطفا دوباره تلاش کنید",
          type: "error",
        });
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
