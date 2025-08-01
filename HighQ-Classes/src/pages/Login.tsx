


// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { ToastAction } from "@/components/ui/toast";
// import characterImage from "@/assets/businessman-character-holding-log-out-page-menu-3d-illustration-png.webp";
// import { motion } from "framer-motion";

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

//   const toggleShowPassword = () => setShowPassword((prev) => !prev);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast({
//         variant: "destructive",
//         title: "Login failed",
//         description: "Please enter both email and password.",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     setTimeout(() => {
//       setIsSubmitting(false);
//       toast({
//         title: "Login Successful",
//         description: `Welcome back, ${email}`,
//         action: <ToastAction altText="Close">Close</ToastAction>,
//       });
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#14b4e0] to-[#0b306e] p-6 pt-20">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-4xl flex items-center bg-white/10 rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-md"
//       >
//         {/* Left Side Image */}
//         <div className="hidden md:flex w-1/2 items-center justify-center">
//           <img
//             src={characterImage}
//             alt="3D Character"
//             className="w-[90%] h-auto object-contain"
//           />
//         </div>

//         {/* Right Side Form */}
//         <div className="w-full md:w-1/2 text-white">

//           {/* Heading Inside Box */}
//           <div className="text-right mb-6">
//             <h2 className="text-2xl font-bold">Sign in to your account</h2>
//             <p className="text-sm">
//               Or{" "}
//               <Link to="/register" className="underline text-white">
//                 create a new account
//               </Link>
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="bg-white/20 placeholder:text-white/70 text-white border border-white/30"
//             />

//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="bg-white/20 placeholder:text-white/70 text-white border border-white/30"
//               />
//               <button
//                 type="button"
//                 onClick={toggleShowPassword}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             {/* Forgot password */}
//             <div className="text-right">
//               <Link
//                 to="/forgot-password"
//                 className="text-sm underline text-white/80 hover:text-white"
//               >
//                 Forgot your password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-white text-[#005BEA] font-semibold hover:bg-gray-200 transition"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>

//           <p className="text-sm mt-6 text-center text-white/80 md:hidden">
//             Don’t have an account?{" "}
//             <Link to="/register" className="underline text-white">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }





import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import characterImage from "@/assets/businessman-character-holding-log-out-page-menu-3d-illustration-png.webp";
import { motion } from "framer-motion";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please enter both email and password.",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${email}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#0d1e3a] to-[#000c1e] p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl flex items-center bg-white/10 rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-md"
      >
        {/* Left Side Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img
            src={characterImage}
            alt="3D Character"
            className="w-[90%] h-auto object-contain"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 text-white">
          {/* Heading Inside Box */}
          <div className="text-right mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              Sign in to your account
            </h2>
            <p className="text-sm text-orange-300">
              Or{" "}
              <Link to="/register" className="underline hover:text-orange-400">
                create a new account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 placeholder:text-white/70 text-white border border-white/30 focus:ring-2 focus:ring-orange-400"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/20 placeholder:text-white/70 text-white border border-white/30 focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm underline text-orange-300 hover:text-orange-400"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-400 text-white font-semibold hover:bg-orange-500 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-sm mt-6 text-center text-orange-300 md:hidden">
            Don’t have an account?{" "}
            <Link to="/register" className="underline hover:text-orange-400">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
