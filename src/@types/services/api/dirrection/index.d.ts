namespace Direction {
  type Modifier =
    | "right"
    | "slight right"
    | "sharp right"
    | "slight left"
    | "sharp left"
    | "left"
    | "uturn"
    | "straight";
  type DirectionParams = {
    origin_lat: number;
    origin_lng: number;
    destination_lat: number;
    destination_lng: number;
    type: string;
    alternative: boolean;
  };
  type DirectionResponse = {
    routes: [
      {
        overview_polyline: {
          points: string;
        };
        legs: [
          {
            summary: string;
            distance: {
              value: number;
              text: string;
            };
            duration: {
              value: number;
              text: string;
            };
            steps: {
              name: string;
              instruction: string;
              bearing_after: number;
              type: string;
              modifier: Modifier;
              distance: {
                value: number;
                text: string;
              };
              duration: {
                value: number;
                text: string;
              };
              polyline: string;
              start_location: number[];
            }[];
          }
        ];
      }
    ];
  };
}
