import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { studentService } from "@/API/services/admin/students.service";
import { CreateStudentData } from "@/types/student.types";

const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateStudentData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    parentName: "",
    parentContact: "",
    grade: "",
    schoolName: "",
    gender: "male",
    dateOfBirth: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = { ...formData, role: "student" };
      const res = await studentService.addStudent(payload);

      if (res.success) {
        setMessage("✅ Student added successfully!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          parentName: "",
          parentContact: "",
          grade: "",
          schoolName: "",
          gender: "male",
          dateOfBirth: "",
          address: { street: "", city: "", state: "", zipCode: "", country: "" },
        });
      } else {
        setMessage(`❌ ${res.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Failed to add student"}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl shadow-xl rounded-lg">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-3xl font-extrabold text-gray-800">Add New Student</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Fill out the form below to create a new student record.</p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="font-semibold text-gray-600">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="email" className="font-semibold text-gray-600">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="mobile" className="font-semibold text-gray-600">Mobile</Label>
                  <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="password" className="font-semibold text-gray-600">Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <Separator />

            {/* Parent Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="parentName" className="font-semibold text-gray-600">Parent Name</Label>
                  <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="parentContact" className="font-semibold text-gray-600">Parent Contact</Label>
                  <Input id="parentContact" name="parentContact" value={formData.parentContact} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <Separator />

            {/* School Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="grade" className="font-semibold text-gray-600">Grade</Label>
                  <Input id="grade" name="grade" value={formData.grade} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="schoolName" className="font-semibold text-gray-600">School Name</Label>
                  <Input id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} required />
                </div>
                <div>
                  <Label className="font-semibold text-gray-600">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: v as "male" | "female" | "other",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth" className="font-semibold text-gray-600">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="street" className="font-semibold text-gray-600">Street</Label>
                  <Input id="street" name="address.street" value={formData.address.street} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="city" className="font-semibold text-gray-600">City</Label>
                  <Input id="city" name="address.city" value={formData.address.city} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="state" className="font-semibold text-gray-600">State</Label>
                  <Input id="state" name="address.state" value={formData.address.state} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="zipCode" className="font-semibold text-gray-600">Postal Code</Label>
                  <Input id="zipCode" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="country" className="font-semibold text-gray-600">Country</Label>
                  <Input id="country" name="address.country" value={formData.address.country} onChange={handleChange} />
                </div>
              </div>
            </div>

            {message && (
              <Alert className={message.startsWith("✅") ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            <CardFooter className="flex justify-end p-0 pt-4">
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? "Adding..." : "Add Student"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentForm;