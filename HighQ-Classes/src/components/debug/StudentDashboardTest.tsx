import React, { useState } from "react";
import { studentService } from "@/API/services/studentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentDashboardTest: React.FC = () => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const testDashboardAPI = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log("🔍 Testing student dashboard API...");
            const data = await studentService.getDashboard();
            console.log("API Response:", data);
            setResult(data);
        } catch (err: any) {
            console.error("❌ API Error:", err);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Dashboard API Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={testDashboardAPI}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? "Testing..." : "Test Student Dashboard API"}
                    </Button>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <h3 className="font-semibold text-red-800">
                                Error:
                            </h3>
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                            <h3 className="font-semibold text-green-800">
                                Success!
                            </h3>
                            <pre className="text-sm mt-2 bg-white p-2 border rounded overflow-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="text-xs text-gray-500">
                        <p>Check browser console for detailed logs</p>
                        <p>
                            Auth token:{" "}
                            {localStorage.getItem("authToken")
                                ? "Present"
                                : "Missing"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentDashboardTest;
