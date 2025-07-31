import { useEffect, useState } from "react";
import axios from "axios";

export const useTeacherDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/teacher/dashboard", {
          withCredentials: true,
        });
        console.log("📊 Teacher Dashboard Response:", res.data); // 👈 add for debug
        setData(res.data);
      } catch (err: any) {
        console.error("❌ Dashboard fetch error:", err); // 👈 add error log
        setError(err.response?.data?.message || "Failed to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading, error };
};
