

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import characterImage from "@/assets/compressed_dce3b29973cb19153b0a51351ed37b78.webp";

// export default function RegisterForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     dob: "",
//     studentType: "",
//     gender: "",
//     parentName: "",
//     parentContact: "",
//     grade: "",
//     school: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const toggleShowPassword = () => setShowPassword((prev) => !prev);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setTimeout(() => setIsSubmitting(false), 2000);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00C6FB] to-[#005BEA] p-6">
//       <div className="w-full max-w-4xl flex items-center bg-white/10 rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-md">
//         {/* Left Section with Image */}
//         <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-center text-white px-4 space-y-4">
//           <img
//             src={characterImage}
//             alt="3D Character"
//             className="w-[95%] h-auto object-contain mt-2 transition-transform duration-500 ease-in-out hover:-translate-y-2"
//           />
//         </div>

//         {/* Register Form Section */}
//         <div className="w-full md:w-1/2 text-white">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="mb-4">
//               <h2 className="text-2xl font-bold text-white">Create your account</h2>
//               <p className="text-sm text-white/80">
//                 Or <Link to="/login" className="underline">sign in to your existing account</Link>
//               </p>
//             </div>

//             <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

//             <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

//             <Input name="mobile" placeholder="Mobile Number (10 digits)" value={formData.mobile} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

//             <select name="studentType" value={formData.studentType} onChange={handleChange} required className="w-full p-2 rounded-md bg-white/30 text-white border border-white/30">
//               <option value="">Role</option>
//               <option value="student">Student</option>
//             </select>

//             <div className="flex gap-4">
//               <select name="gender" value={formData.gender} onChange={handleChange} required className="w-1/2 p-2 rounded-md bg-white/30 text-white border border-white/30">
//                 <option value="">Select Gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>

//               <Input name="dob" type="date" value={formData.dob} onChange={handleChange} required className="w-1/2 bg-white/30 text-white border border-white/30" />
//             </div>

//             <Input name="parentName" placeholder="Parent/Guardian Name" value={formData.parentName} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

//             <Input name="parentContact" placeholder="Parent Contact Number (10 digits)" value={formData.parentContact} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

//             <div className="flex gap-4">
//               <Input name="grade" placeholder="Grade/Class (e.g., 10th, 12th)" value={formData.grade} onChange={handleChange} required className="w-1/2 bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

//               <Input name="school" placeholder="School Name" value={formData.school} onChange={handleChange} required className="w-1/2 bg-white/20 text-white placeholder:text-white/70 border border-white/30" />
//             </div>

//             <div className="relative">
//               <Input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />
//               <button type="button" onClick={toggleShowPassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             <Input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

//             <Button type="submit" className="w-full bg-white text-[#005BEA] font-semibold hover:bg-gray-200 transition mt-4" disabled={isSubmitting}>
//               {isSubmitting ? "Creating Account..." : "Create Account"}
//             </Button>

//             <p className="text-sm mt-4 text-center text-white/80">
//               <Link to="/forgot-password" className="underline">Forgot your password?</Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import characterImage from "@/assets/compressed_dce3b29973cb19153b0a51351ed37b78.webp";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    studentType: "",
    gender: "",
    parentName: "",
    parentContact: "",
    grade: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A2540] to-[#0f172a] p-6">
      <div className="w-full max-w-4xl flex items-center bg-white/10 rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-md">
        {/* Left Section with Image */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-center text-white px-4 space-y-4">
          <img
            src={characterImage}
            alt="3D Character"
            className="w-[95%] h-auto object-contain mt-2 transition-transform duration-500 ease-in-out hover:-translate-y-2"
          />
        </div>

        {/* Register Form Section */}
        <div className="w-full md:w-1/2 text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold" style={{ color: "#F97316" }}>
                Create your account
              </h2>
              <p className="text-sm text-white/80">
                Or <Link to="/login" className="underline">sign in to your existing account</Link>
              </p>
            </div>

            <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

            <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

            <Input name="mobile" placeholder="Mobile Number (10 digits)" value={formData.mobile} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

            <select name="studentType" value={formData.studentType} onChange={handleChange} required className="w-full p-2 rounded-md bg-white/30 text-white border border-white/30">
              <option value="">Role</option>
              <option value="student">Student</option>
            </select>

            <div className="flex gap-4">
              <select name="gender" value={formData.gender} onChange={handleChange} required className="w-1/2 p-2 rounded-md bg-white/30 text-white border border-white/30">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <Input name="dob" type="date" value={formData.dob} onChange={handleChange} required className="w-1/2 bg-white/30 text-white border border-white/30" />
            </div>

            <Input name="parentName" placeholder="Parent/Guardian Name" value={formData.parentName} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

            <Input name="parentContact" placeholder="Parent Contact Number (10 digits)" value={formData.parentContact} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

            <div className="flex gap-4">
              <Input name="grade" placeholder="Grade/Class (e.g., 10th, 12th)" value={formData.grade} onChange={handleChange} required className="w-1/2 bg-white/20 text-white placeholder:text-white/70 border border-white/30" />
              <Input name="school" placeholder="School Name" value={formData.school} onChange={handleChange} required className="w-1/2 bg-white/20 text-white placeholder:text-white/70 border border-white/30" />
            </div>

            <div className="relative">
              <Input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />
              <button type="button" onClick={toggleShowPassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required className="bg-white/20 text-white placeholder:text-white/70 border border-white/30" />

            <Button type="submit" className="w-full bg-white text-[#005BEA] font-semibold hover:bg-gray-200 transition mt-4" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-sm mt-4 text-center text-white/80">
              <Link to="/forgot-password" className="underline">Forgot your password?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
