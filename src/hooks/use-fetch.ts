"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export function useFetch<T>(
  url: string,
  params?: Record<string, string | number | boolean | null | undefined>,
  options?: RequestInit,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [trigger, setTrigger] = useState(0); // used to force re-fetch

  // Build the final URL using useMemo
  const finalUrl = useMemo(() => {
    if (!params) return url;

    if (typeof window === "undefined") {
      return url;
    }

    const urlObj = new URL(url, window.location.origin);

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        urlObj.searchParams.append(key, String(value));
      }
    }

    return urlObj.toString();
  }, [url, params]);

  // Manual refetch function
  const refetch = useCallback(() => {
    setTrigger((n) => n + 1);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(finalUrl, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network error: ${res.status}`);
        }
        return res.json() as Promise<T>;
      })
      .then((json) => {
        if (active) setData(json);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [finalUrl, trigger, options]);

  return { data, loading, error, refetch };
}
