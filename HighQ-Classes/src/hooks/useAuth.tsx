import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
interface User {
    id: string;
    name: string;
    email: string;
    role: "student" | "teacher" | "admin";
    batch?: string;
    admissionDetails?: {
        admissionId: string;
        joiningDate: string;
    };
    feeStatus?: {
        totalFee: number;
        paidAmount: number;
        pendingAmount: number;
        lastPaymentDate: string;
    };
}

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
}

// Mock data
const mockUsers = [
    {
        id: "1",
        name: "John Student",
        email: "student@example.com",
        role: "student",
        batch: "Physics Batch 2023",
        admissionDetails: {
            admissionId: "STU001",
            joiningDate: "2023-01-15",
        },
        feeStatus: {
            totalFee: 12000,
            paidAmount: 8000,
            pendingAmount: 4000,
            lastPaymentDate: "2023-06-10",
        },
    },
    {
        id: "2",
        name: "Mary Teacher",
        email: "teacher@example.com",
        role: "teacher",
    },
    {
        id: "3",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
    },
];

// Create an initial context value to avoid null checks
const initialContextValue: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => {
        throw new Error("AuthContext not initialized");
    },
    logout: () => {
        throw new Error("AuthContext not initialized");
    },
    register: async () => {
        throw new Error("AuthContext not initialized");
    },
};

// Context
const AuthContext = createContext<AuthContextValue>(initialContextValue);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error retrieving user from localStorage:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const foundUser = mockUsers.find(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );

            if (!foundUser) {
                throw new Error("Invalid credentials");
            }

            localStorage.setItem("user", JSON.stringify(foundUser));
            setUser(foundUser as User);

            toast({
                title: "Login Successful",
                description: `Welcome back, ${foundUser.name}!`,
            });
        } catch (error) {
            toast({
                title: "Login Failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        toast({
            title: "Logged Out",
            description: "You have been logged out successfully.",
        });
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (
                mockUsers.some(
                    (u) => u.email.toLowerCase() === email.toLowerCase()
                )
            ) {
                throw new Error("Email already in use");
            }

            const newUser = {
                id: `${mockUsers.length + 1}`,
                name,
                email,
                role: "student",
                batch: "New Students Batch",
                admissionDetails: {
                    admissionId: `STU00${mockUsers.length + 1}`,
                    joiningDate: new Date().toISOString().split("T")[0],
                },
                feeStatus: {
                    totalFee: 12000,
                    paidAmount: 0,
                    pendingAmount: 12000,
                    lastPaymentDate: "",
                },
            } as User;

            mockUsers.push(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);

            toast({
                title: "Registration Successful",
                description: `Welcome, ${name}!`,
            });
        } catch (error) {
            toast({
                title: "Registration Failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// Custom hook
export function useAuth() {
    return useContext(AuthContext);
}
