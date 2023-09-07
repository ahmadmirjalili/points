import { get_fetcher } from "../fetcher";

export const direction = async (
  params: Direction.DirectionParams
): Promise<Direction.DirectionResponse> => {
  return (
    await get_fetcher(
      `direction?origin=${params.origin_lat},${params.origin_lng}&destination=${params.destination_lat},${params.destination_lng}&type=${params.type}&alternative=${params.alternative}`
    )
  ).json();
};
