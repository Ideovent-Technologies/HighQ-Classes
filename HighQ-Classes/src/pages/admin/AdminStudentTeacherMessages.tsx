import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Search,
    Filter,
    Eye,
    Reply,
    Clock,
    User,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
    UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useContactAdmin } from "@/hooks/useContact";

interface StudentTeacherMessage {
    _id: string;
    name: string;
    email: string;
    message: string;
    userRole: "student" | "teacher";
    status: "unread" | "read" | "replied";
    createdAt: string;
    adminReply?: string;
    repliedAt?: string;
    category: string;
}

interface MessagesResponse {
    success: boolean;
    data: StudentTeacherMessage[];
    totalPages: number;
    currentPage: number;
    total: number;
}

const AdminStudentTeacherMessages: React.FC = () => {
    const [messages, setMessages] = useState<StudentTeacherMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] =
        useState<StudentTeacherMessage | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    const { toast } = useToast();
    const { getStudentTeacherMessages, updateMessageStatus } =
        useContactAdmin();

    const fetchMessages = async (page = 1) => {
        setLoading(true);
        try {
            // Fetch only student/teacher messages using the dedicated endpoint
            const response = (await getStudentTeacherMessages(
                page,
                10,
                statusFilter,
                roleFilter
            )) as MessagesResponse;

            if (response.success) {
                setMessages(response.data);
                setTotalPages(response.totalPages);
                setCurrentPage(response.currentPage);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast({
                title: "Error",
                description: "Failed to fetch messages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages(currentPage);
    }, [currentPage, statusFilter, roleFilter]);

    const handleReply = async () => {
        if (!selectedMessage || !replyText.trim()) return;

        setIsReplying(true);
        try {
            await updateMessageStatus(
                selectedMessage._id,
                "replied",
                replyText
            );

            toast({
                title: "Reply Sent",
                description: "Your reply has been sent successfully",
            });

            setReplyText("");
            setSelectedMessage(null);
            fetchMessages(currentPage); // Refresh messages
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send reply",
                variant: "destructive",
            });
        } finally {
            setIsReplying(false);
        }
    };

    const markAsRead = async (messageId: string) => {
        try {
            await updateMessageStatus(messageId, "read");
            fetchMessages(currentPage); // Refresh messages
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            unread: "bg-red-100 text-red-700 border-red-200",
            read: "bg-yellow-100 text-yellow-700 border-yellow-200",
            replied: "bg-green-100 text-green-700 border-green-200",
        };

        return (
            <Badge
                className={
                    variants[status as keyof typeof variants] || variants.unread
                }
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getRoleIcon = (role: string) => {
        return role === "teacher" ? (
            <GraduationCap className="h-4 w-4 text-green-600" />
        ) : (
            <User className="h-4 w-4 text-blue-600" />
        );
    };

    const getRoleBadge = (role: string) => {
        return (
            <Badge
                className={
                    role === "teacher"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-blue-100 text-blue-700 border-blue-200"
                }
            >
                <div className="flex items-center gap-1">
                    {getRoleIcon(role)}
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
            </Badge>
        );
    };

    const filteredMessages = messages.filter((message) => {
        const matchesSearch =
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "all" || message.userRole === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <UserCog className="h-8 w-8 text-blue-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Student & Teacher Messages
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage messages from authenticated students and teachers
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters & Search
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="teacher">Teachers</option>
                        </select>

                        <Button
                            onClick={() => fetchMessages(1)}
                            className="flex items-center gap-2"
                        >
                            <Search className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Messages List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                            Loading messages...
                        </p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                No student or teacher messages found
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredMessages.map((message) => (
                        <motion.div
                            key={message._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                                message.status === "unread"
                                    ? "border-red-200 bg-red-50"
                                    : "border-gray-200"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {message.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {message.email}
                                        </p>
                                    </div>
                                    {getRoleBadge(message.userRole)}
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(message.status)}
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        {new Date(
                                            message.createdAt
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-4 line-clamp-3">
                                {message.message}
                            </p>

                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    {message.status === "unread" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                markAsRead(message._id)
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            <Eye className="h-3 w-3" />
                                            Mark as Read
                                        </Button>
                                    )}

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedMessage(message)
                                                }
                                                className="flex items-center gap-1"
                                            >
                                                <Reply className="h-3 w-3" />
                                                Reply
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Reply to {message.name}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="font-medium text-gray-900 mb-2">
                                                        Original Message:
                                                    </p>
                                                    <p className="text-gray-700">
                                                        {message.message}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Your Reply:
                                                    </label>
                                                    <Textarea
                                                        value={replyText}
                                                        onChange={(e) =>
                                                            setReplyText(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Type your reply here..."
                                                        rows={6}
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedMessage(
                                                                null
                                                            );
                                                            setReplyText("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleReply}
                                                        disabled={
                                                            isReplying ||
                                                            !replyText.trim()
                                                        }
                                                        className="flex items-center gap-2"
                                                    >
                                                        {isReplying ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Reply className="h-4 w-4" />
                                                                Send Reply
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {message.adminReply && (
                                    <div className="text-xs text-green-600">
                                        Replied on{" "}
                                        {new Date(
                                            message.repliedAt!
                                        ).toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {message.adminReply && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-900 mb-1">
                                        Admin Reply:
                                    </p>
                                    <p className="text-sm text-green-800">
                                        {message.adminReply}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdminStudentTeacherMessages;
