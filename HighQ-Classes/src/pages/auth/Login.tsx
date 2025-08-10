import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login, state } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || null;
    const successMessage = (location.state as { message?: string })?.message || null;

    useEffect(() => {
        if (!state.isLoading && state.isAuthenticated && state.user) {
            if (from) {
                navigate(from, { replace: true });
                return;
            }

            const dashboardRoutes = {
                student: "/student/dashboard",
                teacher: "/teacher/dashboard",
                admin: "/dashboard",
            };

            const targetRoute =
                dashboardRoutes[state.user.role as keyof typeof dashboardRoutes] || "/dashboard";
            navigate(targetRoute, { replace: true });
        }
    }, [state.isLoading, state.isAuthenticated, state.user, from, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(formData);

            if (result && result.success && result.user) {
                const user = result.user;
                const dashboardRoutes = {
                    student: "/student/dashboard",
                    teacher: "/teacher/dashboard",
                    admin: "/dashboard",
                };
                const targetRoute =
                    dashboardRoutes[user.role as keyof typeof dashboardRoutes] || "/";
                navigate(targetRoute, { replace: true });
            }
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full space-y-6 border border-blue-100 backdrop-blur-md">
                <div className="text-center">
                    <img
                        src="https://cdn.pixabay.com/photo/2021/08/25/12/45/phishing-6573326_1280.png"
                        alt="Login Banner"
                        className="mx-auto rounded-md mb-4"
                    />
                    <h2 className="text-3xl font-extrabold text-navy-800">Welcome Back 👋</h2>
                    <p className="text-gray-600">Login to continue exploring your dashboard</p>
                </div>

                {successMessage && (
                    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded text-sm">
                        {successMessage}
                    </div>
                )}

                {state.error && (
                    <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded text-sm">
                        {state.error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  required
  className="mt-1 block w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none px-3 py-2 shadow-sm sm:text-sm transition duration-200"
  placeholder="you@example.com"
  value={formData.email}
  onChange={handleChange}
/>

                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
  id="password"
  name="password"
  type="password"
  autoComplete="current-password"
  required
  className="mt-1 block w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none px-3 py-2 shadow-sm sm:text-sm transition duration-200"
  placeholder="••••••••"
  value={formData.password}
  onChange={handleChange}
/>

                        <button
                            type="button"
                            className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500">
                            Forgot password?
                        </Link>
                        <Link to="/register" className="text-blue-600 hover:text-blue-500">
                            Create an account
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
