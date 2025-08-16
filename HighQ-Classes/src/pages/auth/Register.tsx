import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import authService from "@/API/services/authService";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
        gender: "",
        dateOfBirth: "",
        parentName: "",
        parentContact: "",
        grade: "",
        schoolName: "",
        address: "",
        role: "student",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.mobile.trim()
        ) {
            toast({
                title: "Validation Error",
                description:
                    "Please fill in all required fields (name, email, password, mobile)",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        // For student role, validate parent info
        if (formData.role === "student") {
            if (
                !formData.parentName.trim() ||
                !formData.parentContact.trim() ||
                !formData.grade.trim() ||
                !formData.schoolName.trim()
            ) {
                toast({
                    title: "Validation Error",
                    description:
                        "Please fill in all required student fields (parent name, parent contact, grade, school)",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }
        }

        console.log("Submitting registration with data:", formData);

        try {
            // Convert form data to authService RegisterData format
            const registerData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,
                role: formData.role as "student" | "teacher" | "admin",
                gender: formData.gender || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
                parentName: formData.parentName || undefined,
                parentContact: formData.parentContact || undefined,
                grade: formData.grade || undefined,
                schoolName: formData.schoolName || undefined,
                address: formData.address?.trim()
                    ? { street: formData.address.trim() }
                    : undefined,
            };

            const response = await authService.register(registerData);

            if (response.success) {
                console.log("Registration successful:", response);
                toast({
                    title: "Registered Successfully ✅",
                    description:
                        response.message ||
                        "Please wait for admin approval to access your account.",
                });
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    mobile: "",
                    gender: "",
                    dateOfBirth: "",
                    parentName: "",
                    parentContact: "",
                    grade: "",
                    schoolName: "",
                    address: "",
                    role: "student",
                });
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            console.error("Registration error:", err);

            const errorMessage =
                err.message || "Registration failed. Please try again.";

            toast({
                title: "Registration Failed ❌",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
            {/* Floating background shapes */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-purple-300 rounded-full filter blur-3xl opacity-30 animate-pulse" />
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-pink-300 rounded-full filter blur-3xl opacity-30 animate-pulse" />

            <motion.div
                className="grid md:grid-cols-2 bg-white/40 backdrop-blur-lg shadow-xl rounded-3xl overflow-hidden w-full max-w-5xl border border-white/30"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Left: Image */}
                <div className="hidden md:flex bg-gradient-to-b from-indigo-200 to-indigo-400 items-center justify-center p-10">
                    <img
                        src="https://cdn.pixabay.com/photo/2018/07/12/21/32/subscribe-3534409_1280.jpg"
                        alt="Register"
                        className="w-4/5 rounded-2xl shadow-xl object-contain"
                    />
                </div>

                {/* Right: Form */}
                <div className="p-8 bg-white bg-opacity-90 rounded-xl backdrop-blur-sm">
                    <h2 className="text-3xl font-extrabold text-indigo-700 mb-1 text-center">
                        Student Registration
                    </h2>
                    <p className="text-sm text-center text-gray-500 mb-6">
                        Fill the form carefully to create your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="name"
                            placeholder="Full Name *"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="email"
                            placeholder="Email Address *"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        {/* Password with eye icon */}
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password (Min 6 chars, 1 capital letter) *"
                                className="pr-10"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <Input
                            name="mobile"
                            placeholder="Mobile Number (10 digits) *"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex gap-2">
                            <Select
                                value={formData.gender}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, gender: value })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            name="parentName"
                            placeholder="Parent's Name *"
                            value={formData.parentName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="parentContact"
                            placeholder="Parent Contact Number *"
                            value={formData.parentContact}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="grade"
                            placeholder="Grade (e.g., 9, 10, 11) *"
                            value={formData.grade}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="schoolName"
                            placeholder="School Name *"
                            value={formData.schoolName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-xl shadow-lg transition-all"
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
