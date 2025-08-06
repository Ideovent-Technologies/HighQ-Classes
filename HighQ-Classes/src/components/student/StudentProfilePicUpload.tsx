/*import React, { useState } from "react";

type Props = {
  studentId: string;
  onSuccess: (url: string) => void;
  onCancel: () => void;
};

const StudentProfilePicUpload: React.FC<Props> = ({
  studentId,
  onSuccess,
  onCancel,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch(`/api/student/${studentId}/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to upload photo");
      setMsg("Profile picture uploaded!");
      onSuccess(data.url || ""); // Pass uploaded image URL
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMsg(error.message);
      } else {
        setMsg("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-3">
      <h3 className="font-semibold text-xl">Upload Profile Picture</h3>
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <img src={preview} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2" />
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading || !file}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </form>
  );
};

export default StudentProfilePicUpload;
*/