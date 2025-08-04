import React, { useEffect, useState } from "react";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const TeacherProfile = () => {
  const { profile, loading, error, updateProfile } = useTeacherProfile();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [updating, setUpdating] = useState(false);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (profile) {
      setEmail(profile.email || "");
      setMobile(profile.mobile || "");
      setBio(profile.bio || "");
      setProfilePicture(profile.profilePicture || "");
      setAddress(
        profile.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        }
      );
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateProfile({
        email,
        password: password || undefined,
        mobile,
        bio,
        profilePicture,
        address,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile was updated successfully.",
      });

      setPassword("");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Something went wrong while updating your profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-blue-50 border border-blue-100 shadow-md mb-8">
          <CardContent className="p-6 flex items-center gap-6">
            <img
              src={
                profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-blue-300 object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-blue-900">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-600">{profile.mobile || "No Mobile Added"}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Editable Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="text-sm font-medium text-gray-700">Mobile</label>
          <Input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Profile Picture URL */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Profile Picture URL
          </label>
          <Input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-gray-700">Address</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Input
              placeholder="Street"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
            <Input
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <Input
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
            <Input
              placeholder="ZIP Code"
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
            />
            <Input
              placeholder="Country"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <Input
            type="password"
            placeholder="Leave blank to keep unchanged"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={updating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          {updating ? "Updating..." : "Update Profile"}
        </Button>
      </motion.form>
    </div>
  );
};

export default TeacherProfile;
