import { mapStore } from "src/@types/services/hooks/zustand/map";
import { create } from "zustand";

export const useMapStore = create<mapStore.UseMapStore>((set) => ({
  map: null,
  setMap: (map) => set(() => ({ map })),
}));
