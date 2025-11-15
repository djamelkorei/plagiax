import {useEffect, useRef, useState} from "react";
import type {ClientResponse} from "hono/client";

type FetchFn<T> = (...args: unknown[]) => Promise<ClientResponse<T>>;

export function useFetch<T>(fetchFn: FetchFn<T>, deps: unknown[] = [], auto: boolean = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  useEffect(() => {
    if (!auto) return
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const res = await fetchRef.current();
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as T;
        if (!cancelled) {
          setLoading(false)
          setLoading((prev) => {
            setData(json);
            setError(null);
            return prev
          });
        }
      } catch (err) {
        if (!cancelled) {
          setLoading(false)
          setLoading((prev) => {
            setError(err as Error)
            return prev
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [...deps, refreshKey, auto]);

  const refetch = () => setRefreshKey((k) => k + 1);

  return {data, setData, loading, error, refetch};
}
