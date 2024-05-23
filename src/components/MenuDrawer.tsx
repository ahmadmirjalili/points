import { MouseEventHandler, useState, useEffect } from "react";
import styles from "src/assets/styles/components/MenuDrawer.module.css";
import { useMapStore } from "src/services/hooks/zustand/map/useMapStore";
import L from "leaflet";
import { markers } from "src/services/utils/map/markers";
import { useGet } from "src/services/hooks/api/useFether";
import { direction as directionApi } from "src/services/api/direction/indx";
import mapBoxLine from "@mapbox/polyline";
import { variable } from "src/services/utils/constants/variable";
import Spinner from "src/templates/Spinner";
import { modifierHandler } from "src/services/utils/map/directionModifier";
import Marker from "./Marker";

const MenuDrawer = () => {
  const map = useMapStore((state) => state.map);

  const [showMarker, setShowMarker] = useState("");
  const [directionMethod, setDirectionMethod] = useState("car");
  const [selectCustomRoute, setSelectCustomRoute] = useState("");
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [selectRoteModal, setSelectRoteModal] = useState(false);
  const [watchPositionId, setWatchPositionId] = useState(0);
  const [directionPoints, setDirectionPoints] = useState({
    start: {
      complete: false,
      lat: 0,
      lng: 0,
      routeInfo: "",
    },
    end: {
      complete: false,
      lat: 0,
      lng: 0,
      routeInfo: "",
    },
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
      destination_lat: directionPoints.end.lat,
      destination_lng: directionPoints.end.lng,
      origin_lat: directionPoints.start.lat,
      origin_lng: directionPoints.start.lng,
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
            const DirectionLine = L.polyline(item.reverse() as any, {
              color:
                getLocation.length === 1 || i === 1
                  ? variable.primary
                  : variable.error,
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
  let marker: any | null = null;

  const getUserLocation: PositionCallback = (result) => {
    const { latitude, longitude } = result.coords;
    // map?.on('')
    let getIndex = undefined;
    getIndex = directionData?.routes[0].legs[0].steps.findIndex(
      (step, i) => step.start_location[0] + step.start_location[1] < +longitude
    );
    if (getIndex) {
      getIndex > 0 &&
        highlightCustomRoute(
          directionData?.routes[0].legs[0].steps[getIndex].polyline ?? "",
          `button${getIndex ?? ""}`
        );
    }
    if (map && longitude && latitude) {
      if (!!marker) {
        marker.setLatLng([latitude, longitude]).addTo(map);
      } else
        marker = L.marker([latitude, longitude], {
          icon: markers.userLocation,
        }).addTo(map);
    }
  };

  const changShowMarker = (value: string) => {
    setShowMarker(value);
  };
  const userSelectHandler = (step: "start" | "end") => {
    if (map) {
      const { lat, lng } = map.getCenter();
      L.marker([lat, lng], { icon: markers.circleMarker }).addTo(map);
      setDirectionPoints((pre) => ({
        ...pre,
        [step]: {
          complete: true,
          lat: lat,
          lng: lng,
          routeInfo: "",
        },
      }));
    }
    changShowMarker("");
  };
  const cancelDirectionHandler: MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    // @ts-ignore
    const createLayerArr: any[] = Object.values(map?._layers);

    createLayerArr.forEach((layer, i) => {
      if ((!!layer._path || !!layer._icon) && map) {
        map.removeLayer(createLayerArr[i]);
      }
    });
    setDirectionData(undefined);
    setDirectionPoints({
      start: {
        complete: false,
        lat: 0,
        lng: 0,
        routeInfo: "",
      },
      end: {
        complete: false,
        lat: 0,
        lng: 0,
        routeInfo: "",
      },
    });
    setSelectRoteModal(false);
  };

  const selectMethodHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    setDirectionMethod(e.currentTarget.id);
  };
  const highlightCustomRoute = (polyline: string, id: string) => {
    const getCurrentElement = document.getElementById(id);
    openMobileDrawer && mobileDrawerHandler();
    setSelectCustomRoute(polyline);
    if (map) {
      const createLayerArr: any[] = Object.values(
        //@ts-ignore
        map?._layers
      );
      createLayerArr.forEach((layer, i) => {
        if (layer.options.color === variable.success && map) {
          map.removeLayer(createLayerArr[i]);
        }
      });
      const decodePolyline = mapBoxLine.decode(polyline);
      const createLine = L.polyline(decodePolyline, {
        color: variable.success,
      }).addTo(map);
      map.fitBounds(createLine.getBounds());
    }
    if (openMobileDrawer)
      setTimeout(() => {
        getCurrentElement?.scrollIntoView();
      }, 250);
    else getCurrentElement?.scrollIntoView();
    return;
  };
  const mobileDrawerHandler = () => {
    setOpenMobileDrawer((pre) => !pre);
  };
  const selectRouteModalHandler = () => {
    setSelectRoteModal((pre) => !pre);
    clearSearchDirectionInput("start");
    clearSearchDirectionInput("end");
  };
  const clearSearchDirectionInput = (step: "start" | "end") => {
    //@ts-ignore
    const createLayerArr: any[] = Object.values(map?._layers);

    createLayerArr.forEach((layer, i) => {
      if (
        layer?._latlng?.lng === directionPoints[step].lng &&
        layer?._latlng?.lat === directionPoints[step].lat &&
        map
      ) {
        map.removeLayer(createLayerArr[i]);
      }
    });
    changShowMarker("");
    setDirectionPoints((pre) => ({
      ...pre,
      [step]: {
        complete: false,
        lat: 0,
        lng: 0,
        routeInfo: "",
      },
    }));
  };

  return (
    <>
      <button
        className={`${styles.direction_button} ${
          showMarker !== "" || !!directionData || selectRoteModal
            ? styles.hide_direction_button
            : ""
        } material-symbols-outlined`}
        onClick={selectRouteModalHandler}
      >
        directions
      </button>

      {showMarker === "" && !directionData?.routes && selectRoteModal && (
        <div className={styles.drawer_container}>
          <span
            onClick={selectRouteModalHandler}
            className={`material-symbols-outlined ${styles.close_icon}`}
          >
            close
          </span>
          {!directionData?.routes && (
            <>
              <div className={styles.selected_user_location}>
                <label>مبدا</label>
                <div
                  className={styles.search_box}
                  onClick={() => {
                    !directionPoints.start.complete && changShowMarker("start");
                  }}
                >
                  {directionPoints.start.complete
                    ? directionPoints.start.routeInfo !== ""
                      ? directionPoints.start.routeInfo
                      : `${directionPoints.start.lat} , ${directionPoints.start.lng}`
                    : "انتخاب روی نقشه"}
                  {directionPoints.start.complete && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSearchDirectionInput("start");
                      }}
                      className={`material-symbols-outlined ${styles.input_close_icon}`}
                    >
                      close
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.selected_user_location}>
                <label>مقصد</label>
                <div
                  className={styles.search_box}
                  onClick={() =>
                    !directionPoints.end.complete && changShowMarker("end")
                  }
                >
                  {directionPoints.end.complete
                    ? directionPoints.end.routeInfo !== ""
                      ? directionPoints.end.routeInfo
                      : `${directionPoints.end.lat} , ${directionPoints.end.lng}`
                    : "انتخاب روی نقشه"}
                  {directionPoints.end.complete && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSearchDirectionInput("end");
                      }}
                      className={`material-symbols-outlined ${styles.input_close_icon}`}
                    >
                      close
                    </span>
                  )}
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
                className={`${styles.start_button}  ${
                  !(
                    directionPoints.start.complete &&
                    directionPoints.end.complete
                  ) && styles.disable_button
                }`}
                onClick={reFetchDirection}
                disabled={
                  !(
                    directionPoints.start.complete &&
                    directionPoints.end.complete
                  )
                }
              >
                {directionLoading ? <Spinner /> : "بریم"}
              </button>
            </>
          )}
        </div>
      )}
      {!!directionData && (
        <div
          className={`${styles.mobile_drawer_container} ${
            openMobileDrawer ? styles.open_mobile_drawer : ""
          }`}
        >
          <div
            onClick={mobileDrawerHandler}
            className={`${styles.direction_header}  ${styles.mobile_custom_shadow}`}
          >
            <div className={styles.direction_header_text}>
              <span
                onClick={cancelDirectionHandler}
                className={`material-symbols-outlined`}
              >
                close
              </span>
              <div>
                <p className={styles.mobile_direction_text}>
                  {directionData?.routes[0].legs[0].summary}
                </p>
                <div
                  className={`${styles.direction_info} ${styles.mobile_direction_info}`}
                >
                  <div>
                    <p className={styles.mobile_direction_info_text}>
                      {directionData?.routes[0].legs[0].duration.text}
                    </p>
                  </div>
                  <div className={styles.mobile_line} />
                  <div>
                    <p className={styles.mobile_direction_info_text}>
                      {directionData?.routes[0].legs[0].distance.text}
                    </p>
                  </div>
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
                className={`material-symbols-outlined ${
                  openMobileDrawer ? styles.toggle_drawer_icon : ""
                } ${styles.mobile_drawer_icon}`}
              >
                expand_less
              </span>
            </div>
          </div>
          <div className={styles.mobile_direction_container}>
            {directionData?.routes[0].legs[0].steps.map((step, i) => (
              <button
                id={`button${i}`}
                className={`${styles.mobile_direction_route}`}
                onClick={(e) =>
                  highlightCustomRoute(step.polyline, `button${i}`)
                }
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
        </div>
      )}
      {showMarker !== "" && (
        <Marker
          submitHandler={() => userSelectHandler(showMarker as any)}
          cancelHandler={() => changShowMarker("")}
        />
      )}
    </>
  );
};
export default MenuDrawer;
