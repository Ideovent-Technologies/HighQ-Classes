import React, { useEffect, useState } from "react";
import AdminService from "@/API/services/AdminService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  lastLogin?: string;
}

const ActiveUsers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveUsers();
    // eslint-disable-next-line
  }, []);

  const fetchActiveUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AdminService.getActiveUsers();
      if (res.success) {
        setStudents(res.students || []);
        setTeachers(res.teachers || []);
        console.log("Active User:", res);
      } else {
        setError(res.message || "Failed to fetch active users.");
      }
    } catch (err) {
      setError("Failed to fetch active users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Users (Last 24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <>
            <h3 className="font-semibold text-lg mb-2">Students</h3>
            {students.length === 0 ? (
              <div className="text-muted-foreground mb-4">No active students.</div>
            ) : (
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-2 px-3 text-left">Name</th>
                      <th className="py-2 px-3 text-left">Email</th>
                      <th className="py-2 px-3 text-left">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="py-2 px-3">{user.name}</td>
                        <td className="py-2 px-3">{user.email}</td>
                        <td className="py-2 px-3">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h3 className="font-semibold text-lg mb-2">Teachers</h3>
            {teachers.length === 0 ? (
              <div className="text-muted-foreground mb-4">No active teachers.</div>
            ) : (
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-2 px-3 text-left">Name</th>
                      <th className="py-2 px-3 text-left">Email</th>
                      <th className="py-2 px-3 text-left">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="py-2 px-3">{user.name}</td>
                        <td className="py-2 px-3">{user.email}</td>
                        <td className="py-2 px-3">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveUsers;