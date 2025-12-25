import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url) => {
  const baseUrl = "http://localhost:3004";
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({});
  const token = localStorage.getItem("token");

  const doFetch = (options = {}) => {
    setOptions(options);
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isLoading) {
          return;
        }
        const requestOptions = {
          ...options,
          ...{
            headers: {
              authorization: token ? `Token ${token}` : "",
            },
          },
        };
        const res = await axios.request(baseUrl + url, requestOptions);
        setResponse(res.data);
      } catch (err) {
        setError(err.response.data);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [isLoading, options, token, url]);

  return [{ response, isLoading, error }, doFetch];
};

export default useFetch;
