import React, { useState, useEffect } from "react";
import { studentService } from "@/API/services/studentService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/API/Axios";

const ComprehensiveTest: React.FC = () => {
    const { state, login } = useAuth();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const addResult = (
        test: string,
        status: "success" | "error",
        data: any
    ) => {
        setResults((prev) => [
            ...prev,
            { test, status, data, timestamp: new Date().toISOString() },
        ]);
    };

    const runTests = async () => {
        setLoading(true);
        setResults([]);

        try {
            // Test 1: Check localStorage
            const token = localStorage.getItem("authToken");
            const user = localStorage.getItem("user");
            addResult("localStorage Check", token ? "success" : "error", {
                hasToken: !!token,
                tokenPreview: token
                    ? token.substring(0, 20) + "..."
                    : "No token",
                hasUser: !!user,
                userPreview: user ? JSON.parse(user) : "No user",
            });

            // Test 2: Check auth context
            addResult(
                "Auth Context",
                state.isAuthenticated ? "success" : "error",
                {
                    isAuthenticated: state.isAuthenticated,
                    user: state.user,
                    isLoading: state.isLoading,
                    error: state.error,
                }
            );

            // Test 3: Try to login programmatically
            if (!state.isAuthenticated) {
                try {
                    const loginResult = await login({
                        email: "sneha.patel@student.com",
                        password: "Password@123",
                    });
                    addResult(
                        "Programmatic Login",
                        loginResult.success ? "success" : "error",
                        loginResult
                    );
                } catch (err: any) {
                    addResult("Programmatic Login", "error", err.message);
                }
            }

            // Test 4: Direct API call to login endpoint
            try {
                const loginResponse = await api.post("/auth/login", {
                    email: "sneha.patel@student.com",
                    password: "Password@123",
                });
                addResult("Direct Login API", "success", loginResponse.data);

                // Store token if successful
                if (loginResponse.data.token) {
                    localStorage.setItem("authToken", loginResponse.data.token);
                    localStorage.setItem(
                        "user",
                        JSON.stringify(loginResponse.data.data)
                    );
                }
            } catch (err: any) {
                addResult(
                    "Direct Login API",
                    "error",
                    err.response?.data || err.message
                );
            }

            // Test 5: Try student dashboard API
            try {
                const dashboardData = await studentService.getDashboard();
                addResult("Student Dashboard API", "success", dashboardData);
            } catch (err: any) {
                addResult(
                    "Student Dashboard API",
                    "error",
                    err.response?.data || err.message
                );
            }

            // Test 6: Direct API call to dashboard
            try {
                const directDashboard = await api.get("/student/dashboard");
                addResult(
                    "Direct Dashboard API",
                    "success",
                    directDashboard.data
                );
            } catch (err: any) {
                addResult(
                    "Direct Dashboard API",
                    "error",
                    err.response?.data || err.message
                );
            }
        } catch (error: any) {
            addResult("Test Suite", "error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Comprehensive Student Dashboard Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={runTests}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Running Tests..." : "Run All Tests"}
                    </Button>

                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`p-4 border rounded ${
                                    result.status === "success"
                                        ? "bg-green-50 border-green-200"
                                        : "bg-red-50 border-red-200"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3
                                        className={`font-semibold ${
                                            result.status === "success"
                                                ? "text-green-800"
                                                : "text-red-800"
                                        }`}
                                    >
                                        {result.test}
                                    </h3>
                                    <span
                                        className={`text-xs ${
                                            result.status === "success"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {result.status === "success"
                                            ? " PASS"
                                            : "❌ FAIL"}
                                    </span>
                                </div>
                                <pre className="text-sm bg-white p-2 border rounded overflow-auto max-h-40">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(
                                        result.timestamp
                                    ).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComprehensiveTest;
