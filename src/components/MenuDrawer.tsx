import { MouseEventHandler, useState } from "react";
import styles from "src/assets/styles/components/MenuDrawer.module.css";
import { useMapStore } from "src/services/hooks/zustand/map/useMapStore";
import L from "leaflet";
import { markers } from "src/services/utils/map/markers";
import Marker from "./Marker";
import { useGet } from "src/services/hooks/api/useFether";
import { direction as directionApi } from "src/services/api/direction/indx";
import mapBoxLine from "@mapbox/polyline";
import { color } from "src/services/utils/constants/color";
import Spinner from "src/templates/Spinner";
import { modifierHandler } from "src/services/utils/map/directionModifier";

const MenuDrawer = () => {
  const map = useMapStore((state) => state.map);

  const [showMarker, setShowMarker] = useState(false);
  const [directionMethod, setDirectionMethod] = useState("car");
  const [selectCustomRoute, setSelectCustomRoute] = useState("");
  const [directionPoints, setDirectionPoints] = useState({
    start: [0, 0],
    end: [0, 0],
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
      enable: false,
      onSuccess(res) {
        if (map) {
          const getLocation = res.routes.map((item) =>
            item.legs[0].steps.map((step, i) =>
              mapBoxLine.decode(step.polyline)
            )
          );
          getLocation.length !== 1 && getLocation.reverse();
          getLocation.map((item, i) => {
            L.polyline(item.reverse() as any, {
              color:
                getLocation.length === 1 || i === 1
                  ? color.primary
                  : color.error,
              dashArray: i === 2 ? "10" : undefined,
            }).addTo(map);

            map.setView(
              res.routes[0].legs[0].steps[0].start_location.reverse() as any,
              20
            );
          });
        }
      },
    }
  );

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

  return (
    <>
      {!showMarker && (
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
      {showMarker && <Marker onClick={userSelectHandler} />}
    </>
  );
};
export default MenuDrawer;
