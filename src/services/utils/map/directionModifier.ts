export const modifierHandler = (modifier: Direction.Modifier) => {
  switch (modifier) {
    case "left":
      return "turn_left";
    case "right":
      return "turn_right";
    case "sharp left":
      return "turn_sharp_left";
    case "sharp right":
      return "turn_sharp_right";
    case "slight left":
      return "turn_slight_left";
    case "slight right":
      return "turn_slight_right";
    case "straight":
      return "straight";
    case "uturn":
      return "u_turn_right";
    default:
      return "location_on";
  }
};
