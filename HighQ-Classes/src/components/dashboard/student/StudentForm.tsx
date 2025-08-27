import React, { useState } from "react";
import AdminService from "@/API/services/AdminService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AddStudentForm: React.FC = () => {
  const [formData, setFormData] = useState({
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
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await AdminService.addStudent(formData);
    setLoading(false);

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
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
    } else {
      setMessage(`❌ ${res.message}`);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add New Student</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          {/* Parent Info */}
          <Separator />
          <h3 className="font-semibold text-lg">Parent Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parentName">Parent Name</Label>
              <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="parentContact">Parent Contact</Label>
              <Input id="parentContact" name="parentContact" value={formData.parentContact} onChange={handleChange} required />
            </div>
          </div>

          {/* School Info */}
          <Separator />
          <h3 className="font-semibold text-lg">School Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input id="grade" name="grade" value={formData.grade} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="schoolName">School Name</Label>
              <Input id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} required />
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
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

          {/* Address */}
          <Separator />
          <h3 className="font-semibold text-lg">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" name="address.postalCode" value={formData.address.postalCode} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="address.country" value={formData.address.country} onChange={handleChange} />
            </div>
          </div>

          {message && (
            <Alert className={message.startsWith("✅") ? "bg-green-50" : "bg-red-50"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? "Adding..." : "Add Student"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddStudentForm;
