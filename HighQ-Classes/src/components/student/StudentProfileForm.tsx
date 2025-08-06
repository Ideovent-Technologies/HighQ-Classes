/*import React, { useState } from "react";

type Props = {
  studentId: string;
  initialEmail: string;
  initialPhone: string;
  onSuccess: (updated: { email: string; phone: string }) => void;
  onCancel: () => void;
};

const StudentProfileForm: React.FC<Props> = ({
  studentId,
  initialEmail,
  initialPhone,
  onSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/student/${studentId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");
      setMsg("Profile updated successfully!");
      onSuccess({ email, phone }); // Notify parent
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
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h3 className="font-semibold text-xl">Edit Profile</h3>
      <label className="block">
        Email:
        <input
          type="email"
          className="border p-2 rounded w-full mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block">
        Phone:
        <input
          type="tel"
          className="border p-2 rounded w-full mt-1"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Update"}
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

export default StudentProfileForm;*/
