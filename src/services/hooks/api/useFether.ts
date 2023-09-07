import { useEffect, useState } from "react";
import { UseFetcher } from "src/@types/services/hooks/api/useFetcher";

export const useGet = <P extends unknown, R extends unknown>(
  fetcherFn: (params: P) => R,
  params: P,
  config?: UseFetcher.UseGetConfig<Awaited<R>>
) => {
  const [data, setData] = useState<Awaited<R>>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function getRequest() {
    try {
      setIsLoading(true);
      const result = await fetcherFn(params);
      config?.onSuccess && config?.onSuccess(result);
      setData(result);
      setIsLoading(false);
    } catch (error: unknown) {
      setIsLoading(false);
      setIsError(true);
      config?.onError && config?.onError(error);
    }
  }
  useEffect(() => {
    if (config?.enable || typeof config?.enable === "undefined") {
      getRequest();
    }
  }, [config?.enable]);

  return {
    isLoading,
    data,
    refetch: getRequest,
    isError,
    setData,
  };
};

export const useMutate = <P extends unknown, R extends unknown>(
  fetcherFn: (params: P) => Promise<R>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const mutate = (params: P, config: UseFetcher.UseMutateConfig<R>) => {
    const { onError, onSuccess } = config;
    setIsLoading(true);
    fetcherFn(params)
      .then((result) => {
        setIsLoading(false);
        onSuccess && onSuccess(result);
      })
      .catch((error) => {
        console.log(error?.response);
        onError && onError(error?.response?.data ?? error);
        setIsLoading(false);
        setIsError(true);
      });
  };
  return {
    mutate,
    isLoading,
    isError,
  };
};
