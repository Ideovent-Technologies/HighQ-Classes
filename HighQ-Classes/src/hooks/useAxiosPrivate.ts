// src/hooks/useAxiosPrivate.ts
import { useEffect } from "react";
import { axiosPrivate } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const useAxiosPrivate = () => {
  const { state } = useAuth(); // correct from your AuthContext

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        const token = state.user?.accessToken; // correct property path
        if (token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [state]);

  return axiosPrivate;
};

export default useAxiosPrivate;
