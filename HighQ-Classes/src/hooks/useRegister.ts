// hooks/useRegister.ts
import axios from "axios";
import { useState } from "react";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (formData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/auth/register", formData);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
