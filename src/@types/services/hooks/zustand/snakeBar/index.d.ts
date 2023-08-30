export namespace snakeBarStore {
  type InitialState = {
    open: boolean;
    type: "error" | "warning" | "success" | "none";
    text: string;
  };
  type UseSnakeBarStore = {
    snakeBar: InitialState;
    setSnakeBar: (snakeBar: InitialState) => void;
  };
}
