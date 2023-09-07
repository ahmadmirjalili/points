export namespace UseFetcher {
  type UseGetConfig<R> = {
    enable?: boolean;
    onError?: (err: unknown) => void;
    onSuccess?: (res: R) => void;
  };
  type UseMutateConfig<R> = {
    onError?: (err: unknown) => void;
    onSuccess?: (result: R) => void;
  };
}
