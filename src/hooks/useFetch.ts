import { useRef, useState } from 'react';

export function useFetch<Data>(...args: Parameters<typeof fetch>): {
  data: Data | null;
  loading: boolean;
  error: Response | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Response | null>(null);
  const [data, setData] = useState<Data | null>(null);

  const fetchRef = useRef(false);
  if (!fetchRef.current) {
    fetch(...args).then(res => {
      if (!res.ok) {
        setLoading(false);
        setError(res);
      } else {
        res.json().then(data => {
          setLoading(false);
          setData(data);
        });
      }
    });
    fetchRef.current = true;
  }
  return { data, loading, error };
}
