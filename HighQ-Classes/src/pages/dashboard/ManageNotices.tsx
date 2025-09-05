import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Users,
  Search,
  Filter,
  Loader2,
  CheckCircle,
} from "lucide-react";
import noticeService from "@/API/services/noticeService"; // ✅ use our noticeService
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Notice } from "../../types/notice.types"; // ✅ use shared type

interface NoticeFormData {
  title: string;
  description: string; // changed from "content" → matches backend schema
  isImportant: boolean;
}

const ManageNotices: React.FC = () => {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [formData, setFormData] = useState<NoticeFormData>({
    title: "",
    description: "",
    isImportant: false,
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);

    try {
      const response = await noticeService.getAllNotices();

      // Normalize the response to ensure it's always an array
      // This is the most crucial part to prevent the error.
      const noticeArray = Array.isArray(response)
        ? response
        : response?.notices && Array.isArray(response.notices)
        ? response.notices
        : [];

      setNotices(noticeArray);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch notices",
        variant: "destructive",
      });
      setNotices([]); // Ensure state is an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await noticeService.createNotice(formData);
    if (response.success && response.notice) {
      toast({
        title: "Success",
        description: "Notice created successfully",
        variant: "default",
      });
      setNotices((prev) => [response.notice!, ...prev]);
      setIsDialogOpen(false);
      setFormData({ title: "", description: "", isImportant: false });
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const response = await noticeService.deleteNotice(id);
    if (response.success) {
      toast({
        title: "Deleted",
        description: response.message,
        variant: "default",
      });
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  // FIX: Added a defensive check here to ensure 'notices' is an array.
  // This is the most direct fix for the original 'TypeError'.
  const filteredNotices = (Array.isArray(notices) ? notices : []).filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "important" && notice.isImportant) ||
      (filterType === "active" && notice.isActive);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-600" />
            Manage Notices
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage system notices for all users
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Create New Notice
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter notice title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter notice description"
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="important"
                  checked={formData.isImportant}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isImportant: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="important">Mark as Important</Label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Notice
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter notices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notices</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Notices</p>
                <p className="text-2xl font-bold">{notices.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Notices</p>
                <p className="text-2xl font-bold">
                  {notices.filter((n) => n.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Important</p>
                <p className="text-2xl font-bold">
                  {notices.filter((n) => n.isImportant).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            All Notices ({filteredNotices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="text-center p-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Notice Management
              </h3>
              <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== "all"
                    ? "Try adjusting your filters"
                    : "No notices found"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotices.map((notice) => (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notice.title}
                        </h3>
                        {notice.isImportant && (
                          <Badge variant="destructive">Important</Badge>
                        )}
                        {notice.isActive && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">
                        {notice.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(notice._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageNotices;