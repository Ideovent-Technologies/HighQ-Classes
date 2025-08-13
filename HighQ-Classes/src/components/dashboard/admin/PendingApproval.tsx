import React, { useEffect, useState } from "react";
import AdminService from "@/API/services/AdminService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const statusOptions = {
  student: ["pending", "active", "suspended", "inactive"],
  teacher: ["pending", "active", "suspended", "inactive", "on-leave"],
};

const PendingApproval: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<{ students: any[]; teachers: any[] }>({ students: [], teachers: [] });
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    const res = await AdminService.getPendingApprovals();
    if (res.success) {
      setPending({ students: res.students || [], teachers: res.teachers || [] });
    } else {
      toast({ title: "Error", description: res.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleStatusChange = async (
    user: any,
    role: "student" | "teacher",
    newStatus: string
  ) => {
    setUpdating((prev) => ({ ...prev, [user._id]: true }));
    const res = await AdminService.changeUserStatus(user._id, role, newStatus);
    if (res.success) {
      toast({ title: "Status Updated", description: `${user.name}'s status changed to ${newStatus}` });
      // Remove from pending list if not pending anymore
      setPending((prev) => ({
        ...prev,
        [role + "s"]: prev[role + "s"].filter((u: any) =>
          u._id === user._id ? newStatus === "pending" : true
        ).map((u: any) =>
          u._id === user._id ? { ...u, status: newStatus } : u
        ),
      }));
    } else {
      toast({ title: "Error", description: res.message, variant: "destructive" });
    }
    setUpdating((prev) => ({ ...prev, [user._id]: false }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            {[["students", "student"], ["teachers", "teacher"]].map(([key, role]) => (
              <div key={role}>
                <h3 className="font-semibold text-lg mb-2 capitalize">{role}s</h3>
                {pending[key as "students" | "teachers"].length === 0 ? (
                  <div className="text-muted-foreground mb-4">No pending {role}s.</div>
                ) : (
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full border text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="py-2 px-3 text-left">Name</th>
                          <th className="py-2 px-3 text-left">Email</th>
                          <th className="py-2 px-3 text-left">Status</th>
                          <th className="py-2 px-3 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pending[key as "students" | "teachers"].map((user: any) => (
                          <tr key={user._id} className="border-b">
                            <td className="py-2 px-3">{user.name}</td>
                            <td className="py-2 px-3">{user.email}</td>
                            <td className="py-2 px-3 capitalize">{user.status}</td>
                            <td className="py-2 px-3">
                              <Select
                                value={user.status}
                                onValueChange={(val) => handleStatusChange(user, role as "student" | "teacher", val)}
                                disabled={updating[user._id]}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions[role as "student" | "teacher"].map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApproval;