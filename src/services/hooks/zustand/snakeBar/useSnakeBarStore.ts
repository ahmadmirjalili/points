import { snakeBarStore } from "src/@types/services/hooks/zustand/snakeBar";
import { create } from "zustand";

export const useSnakeBarStore = create<snakeBarStore.UseSnakeBarStore>(
  (set) => ({
    snakeBar: {
      open: false,
      type: "warning",
      text: "",
    },
    setSnakeBar: (snakeBar) => set(() => ({ snakeBar })),
  })
);
