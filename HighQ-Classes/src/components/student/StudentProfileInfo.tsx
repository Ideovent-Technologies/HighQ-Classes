/*import React, { useState, useEffect } from "react";
import StudentProfileForm from "./StudentProfileForm";
import StudentProfilePicUpload from "./StudentProfilePicUpload";
import ChangePasswordForm from "./ChangePasswordForm";

// Dummy Auth hook — replace with real context when available
const useAuth = () => {
  return {
    studentId: localStorage.getItem("studentId") || "",
  };
};

type StudentProfile = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  profilePictureUrl?: string;
};

const StudentProfileInfo: React.FC = () => {
  const { studentId } = useAuth();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);
  const [changePwd, setChangePwd] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/student/${studentId}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}` // ✅ correct key
,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
        setProfile(data.profile || data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  const handleProfileUpdated = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updated } : prev));
    setEditMode(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return <div className="p-6">No profile data found.</div>;

  return (
    <div className="p-6 mx-auto max-w-lg bg-white/80 backdrop-blur rounded-xl shadow-md">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {profile.profilePictureUrl ? (
            <img
              src={profile.profilePictureUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-blue-700">
              {profile.fullName?.charAt(0) || "S"}
            </div>
          )}
          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 text-xs hover:bg-blue-700"
            title="Change profile photo"
            onClick={() => setEditPhoto(true)}
          >
            <svg width={16} height={16} fill="currentColor">
              <path d="M4 13V9a1 1 0 0 1 1-1h2.586c.265 0 .52.105.707.293l5.414 5.414A1 1 0 0 1 13 15H5a1 1 0 0 1-1-1zm7.293-7.707l-3.586 3.586A1 1 0 0 1 7 9.586V9H6V8h.586a1 1 0 0 1 .707-.293l3.586-3.586a1 1 0 0 1 1.414 1.414z" />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-semibold mt-2">{profile.fullName}</h2>
        <div className="text-gray-500">Student</div>
      </div>

      {!editMode && !editPhoto && !changePwd && (
        <div>
          <div className="mb-4">
            <div className="text-gray-800">
              <span className="font-bold">Email:</span>{" "}
              <span className="font-mono">{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="text-gray-800">
                <span className="font-bold">Phone:</span>{" "}
                <span className="font-mono">{profile.phone}</span>
              </div>
            )}
            {profile.gender && (
              <div className="text-gray-800">
                <span className="font-bold">Gender:</span> {profile.gender}
              </div>
            )}
            {profile.dob && (
              <div className="text-gray-800">
                <span className="font-bold">Date of Birth:</span> {profile.dob}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => setChangePwd(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      {editMode && (
        <div className="pt-4">
          <StudentProfileForm
            studentId={profile._id}
            initialEmail={profile.email}
            initialPhone={profile.phone || ""}
            onSuccess={handleProfileUpdated}
            onCancel={() => setEditMode(false)}
          />
        </div>
      )}

      {editPhoto && (
        <div className="pt-4">
          <StudentProfilePicUpload
            studentId={profile._id}
            onSuccess={(url) => {
              setProfile((prev) =>
                prev ? { ...prev, profilePictureUrl: url } : prev
              );
              setEditPhoto(false);
            }}
            onCancel={() => setEditPhoto(false)}
          />
        </div>
      )}

      {changePwd && (
        <div className="pt-4">
          <ChangePasswordForm
            studentId={profile._id}
            onSuccess={() => setChangePwd(false)}
            onCancel={() => setChangePwd(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StudentProfileInfo;
*/