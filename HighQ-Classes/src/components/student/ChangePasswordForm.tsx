/*import React, { useState } from "react";

type Props = {
  studentId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const ChangePasswordForm: React.FC<Props> = ({
  studentId,
  onSuccess,
  onCancel,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (newPassword !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/student/${studentId}/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password");
      setMsg("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
      onSuccess(); // Notify parent
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-semibold text-xl">Change Password</h3>
      <label className="block">
        Current Password:
        <input
          type="password"
          className="border p-2 rounded w-full mt-1"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </label>
      <label className="block">
        New Password:
        <input
          type="password"
          className="border p-2 rounded w-full mt-1"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </label>
      <label className="block">
        Confirm New Password:
        <input
          type="password"
          className="border p-2 rounded w-full mt-1"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Change Password"}
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

export default ChangePasswordForm;
*/