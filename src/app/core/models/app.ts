export type Nil<T> = T | null | undefined;

export type BypassInterceptor = Partial<{
  loading: boolean;
  error: boolean;
}>;
