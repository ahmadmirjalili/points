import { variable } from "./variable";

export const get_fetcher = (
  path: string,
  config: RequestInit = { headers: variable.headers }
) => fetch(`${variable.url}${path}`, config);
