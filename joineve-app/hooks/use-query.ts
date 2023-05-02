import { useCallback, useEffect, useState } from "react";
import { InternalAPIError } from "../api";

export const useQuery = <T>(fetcher: () => Promise<T>, key: string) => {
  const [error, setError] = useState<InternalAPIError | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetch = useCallback(() => {
    setLoading(true);
    fetcher()
      .then((data) => {
        setData(data);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [fetcher]);

  useEffect(() => {
    fetch();
  }, [key]);

  return { data, error, loading, refetch: fetch };
};
