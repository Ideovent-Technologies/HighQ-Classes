import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  _id: string;
  name: string;
  duration: string;
}

interface Batch {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  courseId?: Course;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface TeacherProfile {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  profilePicture?: string;
  bio?: string;
  address?: Address;
  preferences?: any;
  batches?: Batch[];
  courses?: Course[];
}

export const useTeacherProfile = () => {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/teacher/profile", {
        withCredentials: true,
      });
      setProfile(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (
    updatedFields: Partial<Omit<TeacherProfile, "_id" | "batches" | "courses">> & {
      password?: string;
      address?: Address;
    }
  ) => {
    try {
      const res = await axios.put("/api/teacher/profile", updatedFields, {
        withCredentials: true,
      });
      setProfile((prev) => ({
        ...prev!,
        ...res.data.profile,
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Profile update failed");
    }
  };

  return { profile, loading, error, updateProfile };
};
