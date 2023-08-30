import { Map } from "leaflet";

export namespace mapStore {
  type UseMapStore = {
    map: Map | null;
    setMap: (map: Map) => void;
  };
}
