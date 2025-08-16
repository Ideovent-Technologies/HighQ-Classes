// hooks/useMaterials.ts
import { useEffect, useState } from "react";
import axios from "axios";

export const useMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get("/api/materials", { withCredentials: true });
        setMaterials(res.data);
      } catch (err: any) {
        setError(err.message || "Error fetching materials");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return { materials, loading, error };
};
