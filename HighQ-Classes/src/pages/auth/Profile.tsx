import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Profile: React.FC = () => {
    const { state, updateProfile, changePassword, logout } = useAuth();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [profileData, setProfileData] = useState({
        name: state.user?.name || "",
        phone: state.user?.phone || "",
        avatar: state.user?.avatar || "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });

        // Clear password error when user types
        if (name === "newPassword" || name === "confirmNewPassword") {
            setPasswordError("");
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");

        try {
            const success = await updateProfile(profileData);
            if (success) {
                setSuccessMessage("Profile updated successfully!");
                setIsEditingProfile(false);
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Profile update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        setIsLoading(true);
        setPasswordError("");
        setSuccessMessage("");

        try {
            const success = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (success) {
                setSuccessMessage("Password changed successfully!");
                setIsChangingPassword(false);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Password change error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    if (!state.user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Profile Settings
                    </h1>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {state.error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {state.error}
                        </div>
                    )}

                    {/* Profile Information */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Profile Information
                        </h2>

                        {!isEditingProfile ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {state.user.name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {state.user.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 capitalize">
                                        {state.user.role}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {state.user.phone || "Not provided"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleProfileSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleProfileChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleProfileChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {isLoading
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsEditingProfile(false)
                                        }
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Change Password */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Change Password
                        </h2>

                        {!isChangingPassword ? (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Change Password
                            </button>
                        ) : (
                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-4"
                            >
                                {passwordError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                        {passwordError}
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="currentPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmNewPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmNewPassword"
                                        name="confirmNewPassword"
                                        value={passwordData.confirmNewPassword}
                                        onChange={handlePasswordChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {isLoading
                                            ? "Changing..."
                                            : "Change Password"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordError("");
                                            setPasswordData({
                                                currentPassword: "",
                                                newPassword: "",
                                                confirmNewPassword: "",
                                            });
                                        }}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Logout */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Account Actions
                        </h2>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
