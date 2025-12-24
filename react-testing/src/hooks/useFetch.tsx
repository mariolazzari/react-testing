import { useState, useEffect, useRef } from "react";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

type UseFetchState<T> = {
  response: T | null;
  isLoading: boolean;
  error: unknown;
};

const BASE_URL = "http://localhost:3004";

function useFetch<T = unknown>(url: string) {
  const [state, setState] = useState<UseFetchState<T>>({
    response: null,
    isLoading: false,
    error: null,
  });

  const optionsRef = useRef<AxiosRequestConfig | null>(null);

  const doFetch = (options: AxiosRequestConfig = {}) => {
    optionsRef.current = options;
    setState(prev => ({ ...prev, isLoading: true }));
  };

  useEffect(() => {
    if (!state.isLoading || !optionsRef.current) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const requestOptions: AxiosRequestConfig = {
          url: BASE_URL + url,
          ...optionsRef.current,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            ...optionsRef.current?.headers,
          },
        };

        const res = await axios.request<T>(requestOptions);

        setState({
          response: res.data,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        const error =
          err instanceof AxiosError ? err.response?.data ?? err.message : err;

        setState({
          response: null,
          isLoading: false,
          error,
        });
      }
    };

    fetchData();
  }, [state.isLoading, url]);

  return [state, doFetch] as const;
}

export default useFetch;
