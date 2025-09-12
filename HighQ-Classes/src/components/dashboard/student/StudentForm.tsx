import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { studentService } from "@/API/services/admin/students.service";
import { BatchService } from "@/API/services/admin/batches.service";
import { CreateStudentData } from "@/types/student.types";
import { Batch } from "@/types/batch.types";

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

  const [batchId, setBatchId] = useState<string>("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Fetch batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await new BatchService().getAllBatches();
        if (res.success && res.data) {
          setBatches(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch batches", err);
      }
    };
    fetchBatches();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.parentName) {
      newErrors.parentName = "Parent name is required";
    }

    if (!/^\d{10}$/.test(formData.parentContact)) {
      newErrors.parentContact = "Parent contact must be 10 digits";
    }

    if (!formData.grade) {
      newErrors.grade = "Grade is required";
    }

    if (!formData.schoolName) {
      newErrors.schoolName = "School name is required";
    }

    if (!batchId) {
      newErrors.batch = "Please select a batch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        role: "student",
        status: "active",
        batch: batchId,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        mobile: formData.mobile.trim(),
        parentContact: formData.parentContact.trim(),
      };

      console.log("Submitting student payload:", payload);

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
        setBatchId("");
        setErrors({});
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
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
                  {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Parent Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="parentName">Parent Name</Label>
                  <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} required />
                  {errors.parentName && <p className="text-red-500 text-sm">{errors.parentName}</p>}
                </div>
                <div>
                  <Label htmlFor="parentContact">Parent Contact</Label>
                  <Input id="parentContact" name="parentContact" value={formData.parentContact} onChange={handleChange} required />
                  {errors.parentContact && <p className="text-red-500 text-sm">{errors.parentContact}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* School Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" name="grade" value={formData.grade} onChange={handleChange} required />
                  {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
                </div>
                <div>
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} required />
                  {errors.schoolName && <p className="text-red-500 text-sm">{errors.schoolName}</p>}
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, gender: v as "male" | "female" | "other" }))
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
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Batch Select */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Assign Batch</h3>
              <Select value={batchId} onValueChange={(v) => setBatchId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.batch && <p className="text-red-500 text-sm">{errors.batch}</p>}
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="street">Street</Label>
                  <Input id="street" name="address.street" value={formData.address.street} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="address.city" value={formData.address.city} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="address.state" value={formData.address.state} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input id="zipCode" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="address.country" value={formData.address.country} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Messages */}
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
