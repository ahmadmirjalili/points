import { MouseEventHandler, useEffect, useState } from "react";
import styles from "src/assets/styles/components/MenuDrawer.module.css";
import { useMapStore } from "src/services/hooks/zustand/map/useMapStore";
import L, { Marker as MarkerType } from "leaflet";
import { markers } from "src/services/utils/map/markers";
import { useGet } from "src/services/hooks/api/useFether";
import { direction as directionApi } from "src/services/api/direction/indx";
import mapBoxLine from "@mapbox/polyline";
import { color } from "src/services/utils/constants/color";
import Spinner from "src/templates/Spinner";
import { modifierHandler } from "src/services/utils/map/directionModifier";
import Marker from "./Marker";

const MenuDrawer = () => {
  const map = useMapStore((state) => state.map);

  const [showMarker, setShowMarker] = useState(false);
  const [directionMethod, setDirectionMethod] = useState("car");
  const [selectCustomRoute, setSelectCustomRoute] = useState("");
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [watchPositionId, setWatchPositionId] = useState(0);
  const [directionPoints, setDirectionPoints] = useState({
    start: [36.40006289696562, 51.3556571722927],
    end: [35.83585105054595, 50.99441530415788],
  });

  const {
    data: directionData,
    refetch: reFetchDirection,
    isLoading: directionLoading,
    setData: setDirectionData,
  } = useGet(
    directionApi,
    {
      alternative: true,
      destination_lat: directionPoints.end[0],
      destination_lng: directionPoints.end[1],
      origin_lat: directionPoints.start[0],
      origin_lng: directionPoints.start[1],
      type: directionMethod,
    },
    {
      onSuccess(res) {
        if (map) {
          const getLocation = res.routes.map((item) =>
            item.legs[0].steps.map((step, i) =>
              mapBoxLine.decode(step.polyline)
            )
          );
          getLocation.length !== 1 && getLocation.reverse();
          getLocation.map((item, i) => {
            const DirectionLine = L.polyline(item.reverse() as any, {
              color:
                getLocation.length === 1 || i === 1
                  ? color.primary
                  : color.error,
              dashArray: i === 2 ? "10" : undefined,
            }).addTo(map);

            map.fitBounds(DirectionLine.getBounds());
          });
        }
      },
    }
  );
  useEffect(() => {
    if (!!directionData) {
      setWatchPositionId(
        navigator.geolocation.watchPosition(getUserLocation, undefined, {
          enableHighAccuracy: true,
        })
      );
    }
    return navigator.geolocation.clearWatch(watchPositionId);
  }, [directionData]);
  let marker: MarkerType | null = null;
  const getUserLocation: PositionCallback = (result) => {
    console.log("result", result);

    const { latitude, longitude } = result.coords;
    if (map && longitude && latitude) {
      console.log("marker", marker);
      if (!!marker) {
        marker.setLatLng([latitude, longitude]).addTo(map);
      } else
        marker = L.marker([latitude, longitude], {
          icon: markers.userLocation,
        }).addTo(map);
    }
  };

  const changShowMarker = () => {
    setShowMarker((pre) => !pre);
  };
  const userSelectHandler = () => {
    if (map) {
      const { lat, lng } = map.getCenter();
      L.marker([lat, lng], { icon: markers.circleMarker }).addTo(map);

      setDirectionPoints((pre) => {
        if (pre.start.join("") === "00") {
          return {
            ...pre,
            start: [lat, lng],
          };
        } else {
          return {
            ...pre,
            end: [lat, lng],
          };
        }
      });
    }
    changShowMarker();
  };
  const cancelDirectionHandler = () => {
    // @ts-ignore
    const createLayerArr: any[] = Object.values(map?._layers);

    createLayerArr.forEach((layer, i) => {
      if ((!!layer._path || !!layer._icon) && map) {
        map.removeLayer(createLayerArr[i]);
      }
    });
    setDirectionData(undefined);
    setDirectionPoints({ start: [0, 0], end: [0, 0] });
  };

  const selectMethodHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    setDirectionMethod(e.currentTarget.id);
  };
  const highlightCustomRoute: MouseEventHandler<HTMLButtonElement> = (e) => {
    setSelectCustomRoute(e.currentTarget.id);
    if (map) {
      const createLayerArr: any[] = Object.values(
        //@ts-ignore
        map?._layers
      );

      createLayerArr.forEach((layer, i) => {
        if (layer.options.color === color.success && map) {
          map.removeLayer(createLayerArr[i]);
        }
      });
      const decodePolyline = mapBoxLine.decode(e.currentTarget.id);
      const createLine = L.polyline(decodePolyline, {
        color: color.success,
      }).addTo(map);
      map.fitBounds(createLine.getBounds());
    }
    return;
  };
  const mobileDrawerHandler = () => {
    setOpenMobileDrawer((pre) => !pre);
  };

  return (
    <>
      {!showMarker && window.innerWidth > 1024 && (
        <div className={styles.drawer_container}>
          {!directionData?.routes && (
            <>
              <div className={styles.selected_user_location}>
                <label>مبدا</label>
                <div className={styles.search_box} onClick={changShowMarker}>
                  {directionPoints.start.join("") === "00"
                    ? "انتخاب روی نقشه"
                    : directionPoints.start.join(",")}
                </div>
              </div>
              <div className={styles.selected_user_location}>
                <label>مقصد</label>
                <div className={styles.search_box} onClick={changShowMarker}>
                  {directionPoints.end.join("") === "00"
                    ? "انتخاب روی نقشه"
                    : directionPoints.start.join(",")}
                </div>
              </div>
              <div className={styles.direction_method}>
                <div
                  id="car"
                  onClick={selectMethodHandler}
                  className={
                    directionMethod === "car"
                      ? styles.method_selected
                      : undefined
                  }
                >
                  <span className="material-symbols-outlined">
                    directions_car
                  </span>
                </div>
                <div
                  id="motorcycle"
                  onClick={selectMethodHandler}
                  className={
                    directionMethod === "motorcycle"
                      ? styles.method_selected
                      : undefined
                  }
                >
                  <span className="material-symbols-outlined">two_wheeler</span>
                </div>
              </div>
              <button
                className={styles.start_button}
                onClick={reFetchDirection}
              >
                {directionLoading ? <Spinner /> : "بریم"}
              </button>
            </>
          )}
          {!!directionData && (
            <>
              <div className={styles.direction_title}>
                <p className={styles.direction_info_text}>
                  {directionData?.routes[0].legs[0].summary}
                </p>
                <div className={styles.method_selected_show}>
                  <span className="material-symbols-outlined">
                    {directionMethod === "car"
                      ? "directions_car"
                      : "two_wheeler"}
                  </span>
                </div>
              </div>

              <div className={styles.direction_info}>
                <div>
                  <p>{directionData?.routes[0].legs[0].duration.text}</p>
                </div>
                <div className={styles.line} />
                <div>
                  <p> {directionData?.routes[0].legs[0].distance.text}</p>
                </div>
              </div>

              <div className={styles.direction_container}>
                {directionData?.routes[0].legs[0].steps.map((step) => (
                  <button
                    id={step.polyline}
                    className={styles.direction_route}
                    onClick={highlightCustomRoute}
                  >
                    <span className="material-symbols-outlined">
                      {modifierHandler(step.modifier)}
                    </span>
                    <div>
                      <p>{step.instruction}</p>
                      <p>
                        {step.distance.text && (
                          <>
                            {step.distance.text} <span> - </span>{" "}
                            {step.duration.text}
                          </>
                        )}
                      </p>
                    </div>
                    {selectCustomRoute === step.polyline && (
                      <div className={styles.selected} />
                    )}
                  </button>
                ))}
              </div>
              <button
                className={styles.cancel_button}
                onClick={cancelDirectionHandler}
              >
                لغو
              </button>
            </>
          )}
        </div>
      )}
      <div
        className={`${styles.mobile_drawer_container} ${
          openMobileDrawer ? styles.open_mobile_drawer : ""
        }`}
      >
        <div className={styles.mobile_direction_container}>
          {directionData?.routes[0].legs[0].steps.map((step) => (
            <button
              id={step.polyline}
              className={`${styles.direction_route} ${styles.remove_width}`}
              onClick={highlightCustomRoute}
            >
              <span className="material-symbols-outlined">
                {modifierHandler(step.modifier)}
              </span>
              <div>
                <p>{step.instruction}</p>
                <p>
                  {step.distance.text && (
                    <>
                      {step.distance.text} <span> - </span> {step.duration.text}
                    </>
                  )}
                </p>
              </div>
              {selectCustomRoute === step.polyline && (
                <div className={styles.selected} />
              )}
            </button>
          ))}
        </div>
        <div
          className={`${styles.direction_title}  ${styles.mobile_custom_shadow}`}
        >
          <div>
            <p className={styles.mobile_direction_text}>
              {directionData?.routes[0].legs[0].summary}
            </p>
            <div className={`${styles.direction_info} ${styles.no_margin}`}>
              <div>
                <p className={styles.mobile_direction_info_text}>
                  {directionData?.routes[0].legs[0].duration.text}
                </p>
              </div>
              <div className={styles.mobile_line} />
              <div>
                <p className={styles.mobile_direction_info_text}>
                  {" "}
                  {directionData?.routes[0].legs[0].distance.text}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.mobile_icon_container}>
            <div className={styles.mobile_method_selected_show}>
              <span className="material-symbols-outlined">
                {directionMethod === "car" ? "directions_car" : "two_wheeler"}
              </span>
            </div>
            <span
              onClick={mobileDrawerHandler}
              className={`material-symbols-outlined ${
                openMobileDrawer ? styles.toggle_drawer_icon : ""
              } ${styles.mobile_drawer_icon}`}
            >
              expand_less
            </span>
          </div>
        </div>
      </div>
      {showMarker && <Marker onClick={userSelectHandler} />}
    </>
  );
};
export default MenuDrawer;
