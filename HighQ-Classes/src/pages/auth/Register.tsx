import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { RegisterData } from "../../API/services/authService";

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        // Common fields
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student" as "student" | "teacher" | "admin",
        mobile: "", // Changed from phone to mobile to match backend

        // Student-specific fields
        gender: "",
        dateOfBirth: "",
        parentName: "",
        parentContact: "",
        grade: "",
        schoolName: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },

        // Teacher-specific fields
        employeeId: "",
        qualification: "",
        experience: "",
        specialization: "",
        department: "",
        bio: "",

        // Admin-specific fields
        adminDepartment: "",
        designation: "",
        accessLevel: 5,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const { register, state } = useAuth();
    const navigate = useNavigate();

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        // Handle nested address fields
        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        // Clear password error when user types
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...baseData } = formData;

            // Prepare role-specific data
            let registerData: RegisterData = {
                name: baseData.name,
                email: baseData.email,
                password: baseData.password,
                mobile: baseData.mobile,
                role: baseData.role,
            };

            // Add role-specific fields
            if (baseData.role === "student") {
                registerData = {
                    ...registerData,
                    gender: baseData.gender,
                    dateOfBirth: baseData.dateOfBirth,
                    parentName: baseData.parentName,
                    parentContact: baseData.parentContact,
                    grade: baseData.grade,
                    schoolName: baseData.schoolName,
                    address: baseData.address,
                };
            } else if (baseData.role === "teacher") {
                registerData = {
                    ...registerData,
                    employeeId: baseData.employeeId,
                    qualification: baseData.qualification,
                    experience: parseInt(baseData.experience) || 0,
                    specialization: baseData.specialization,
                    department: baseData.department,
                    bio: baseData.bio,
                };
            } else if (baseData.role === "admin") {
                registerData = {
                    ...registerData,
                    employeeId: baseData.employeeId,
                    department: baseData.adminDepartment,
                    designation: baseData.designation,
                    accessLevel: baseData.accessLevel,
                };
            }

            const success = await register(registerData);

            if (success) {
                // Registration successful - redirect to login with success message
                navigate("/login", {
                    replace: true,
                    state: {
                        message:
                            "Registration successful! Please wait for admin approval before logging in.",
                    },
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {state.error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {state.error}
                        </div>
                    )}

                    {passwordError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {passwordError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="mobile"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mobile Number
                            </label>
                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your mobile number (10 digits)"
                                value={formData.mobile}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                maxLength={10}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Student-specific fields */}
                        {formData.role === "student" && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="gender"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Gender
                                        </label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="dateOfBirth"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="parentName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Parent/Guardian Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="parentName"
                                        name="parentName"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter parent/guardian name"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="parentContact"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Parent Contact Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="parentContact"
                                        name="parentContact"
                                        required
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter parent contact (10 digits)"
                                        value={formData.parentContact}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="grade"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Grade/Class *
                                        </label>
                                        <input
                                            type="text"
                                            id="grade"
                                            name="grade"
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="e.g., 10th, 12th"
                                            value={formData.grade}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="schoolName"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            School Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="schoolName"
                                            name="schoolName"
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter school name"
                                            value={formData.schoolName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Teacher-specific fields */}
                        {formData.role === "teacher" && (
                            <>
                                <div>
                                    <label
                                        htmlFor="employeeId"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Employee ID *
                                    </label>
                                    <input
                                        type="text"
                                        id="employeeId"
                                        name="employeeId"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter employee ID"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="qualification"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Qualification *
                                    </label>
                                    <input
                                        type="text"
                                        id="qualification"
                                        name="qualification"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="e.g., M.Sc Mathematics, B.Tech CSE"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="experience"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Experience (Years) *
                                        </label>
                                        <input
                                            type="number"
                                            id="experience"
                                            name="experience"
                                            required
                                            min="0"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter years of experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="department"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Department *
                                        </label>
                                        <select
                                            id="department"
                                            name="department"
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.department}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Department
                                            </option>
                                            <option value="Mathematics">
                                                Mathematics
                                            </option>
                                            <option value="Science">
                                                Science
                                            </option>
                                            <option value="English">
                                                English
                                            </option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Social Science">
                                                Social Science
                                            </option>
                                            <option value="Computer Science">
                                                Computer Science
                                            </option>
                                            <option value="Physics">
                                                Physics
                                            </option>
                                            <option value="Chemistry">
                                                Chemistry
                                            </option>
                                            <option value="Biology">
                                                Biology
                                            </option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="specialization"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Specialization *
                                    </label>
                                    <input
                                        type="text"
                                        id="specialization"
                                        name="specialization"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter specialization area"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="bio"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Bio/About
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Brief description about yourself"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {/* Admin-specific fields */}
                        {formData.role === "admin" && (
                            <>
                                <div>
                                    <label
                                        htmlFor="employeeId"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Employee ID *
                                    </label>
                                    <input
                                        type="text"
                                        id="employeeId"
                                        name="employeeId"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Enter employee ID"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="adminDepartment"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Department *
                                        </label>
                                        <select
                                            id="adminDepartment"
                                            name="adminDepartment"
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={formData.adminDepartment}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select Department
                                            </option>
                                            <option value="Academic">
                                                Academic
                                            </option>
                                            <option value="Administrative">
                                                Administrative
                                            </option>
                                            <option value="IT">IT</option>
                                            <option value="Finance">
                                                Finance
                                            </option>
                                            <option value="HR">HR</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="designation"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Designation *
                                        </label>
                                        <input
                                            type="text"
                                            id="designation"
                                            name="designation"
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="e.g., System Administrator"
                                            value={formData.designation}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
