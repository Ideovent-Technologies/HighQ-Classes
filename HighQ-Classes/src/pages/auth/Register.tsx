import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const roles = ["student", "teacher", "admin"];

export default function Register() {
  const [selectedRole, setSelectedRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<any>({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    grade: "",
    school: "",
    parentContact: "",
    subjectExpertise: "",
    experience: "",
    qualification: "",
    employeeId: "",
    department: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setFormData((prev: any) => ({ ...prev, role }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // TODO: Send to backend via API
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-8">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.pixabay.com/photo/2017/10/05/14/43/register-2819608_1280.jpg')",
          }}
        ></motion.div>

        {/* Form side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 sm:p-10 md:p-12"
        >
          <h2 className="text-3xl font-bold text-blue-800 mb-1">Create Account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Join HighQ-Classes today and unlock your academic potential!
          </p>

          {/* Role Toggle */}
          <div className="flex space-x-2 mb-5">
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                onClick={() => handleRoleChange(role)}
                className="capitalize rounded-full px-5 text-sm"
              >
                {role}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="pr-10"
                required
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center text-blue-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Conditional Fields */}
            {selectedRole === "student" && (
              <>
                <Input
                  name="grade"
                  placeholder="Grade/Class"
                  value={formData.grade}
                  onChange={handleChange}
                />
                <Input
                  name="school"
                  placeholder="School Name"
                  value={formData.school}
                  onChange={handleChange}
                />
                <Input
                  name="parentContact"
                  placeholder="Parent Contact"
                  value={formData.parentContact}
                  onChange={handleChange}
                />
              </>
            )}

            {selectedRole === "teacher" && (
              <>
                <Input
                  name="subjectExpertise"
                  placeholder="Subject Expertise"
                  value={formData.subjectExpertise}
                  onChange={handleChange}
                />
                <Input
                  name="experience"
                  placeholder="Experience (years)"
                  value={formData.experience}
                  onChange={handleChange}
                />
                <Input
                  name="qualification"
                  placeholder="Highest Qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                />
              </>
            )}

            {selectedRole === "admin" && (
              <>
                <Input
                  name="employeeId"
                  placeholder="Employee ID"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
                <Input
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 transition-all shadow-xl rounded-full text-white font-semibold text-lg py-2"
            >
              Register
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
