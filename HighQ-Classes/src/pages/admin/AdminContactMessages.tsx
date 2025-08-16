import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useContactAdmin } from "@/hooks/useContact";
import {
    Mail,
    Calendar,
    User,
    MessageSquare,
    Eye,
    Reply,
    CheckCircle2,
    Clock,
    Filter,
    Search,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    message: string;
    status: "unread" | "read" | "replied";
    createdAt: string;
    adminReply?: string;
    repliedAt?: string;
    formattedDate: string;
}

const AdminContactMessages: React.FC = () => {
    const { getContactMessages, updateMessageStatus, loading } =
        useContactAdmin();

    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(
        []
    );
    const [selectedMessage, setSelectedMessage] =
        useState<ContactMessage | null>(null);
    const [replyText, setReplyText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    // Fetch messages
    const fetchMessages = async () => {
        try {
            const response = await getContactMessages(
                currentPage,
                10,
                statusFilter
            );
            setMessages(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            toast.error("Failed to load messages");
        }
    };

    // Filter messages based on search and status
    useEffect(() => {
        let filtered = messages;

        if (searchTerm) {
            filtered = filtered.filter(
                (msg) =>
                    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    msg.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredMessages(filtered);
    }, [messages, searchTerm]);

    // Load messages on component mount and filter changes
    useEffect(() => {
        fetchMessages();
    }, [currentPage, statusFilter]);

    // Mark message as read when opened
    const handleMessageClick = async (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsDialogOpen(true);

        if (message.status === "unread") {
            try {
                await updateMessageStatus(message._id, "read");
                // Update local state
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === message._id
                            ? { ...msg, status: "read" }
                            : msg
                    )
                );
            } catch (error) {
                toast.error("Failed to mark message as read");
            }
        }
    };

    // Send reply
    const handleReply = async () => {
        if (!selectedMessage || !replyText.trim()) return;

        setIsReplying(true);
        try {
            await updateMessageStatus(
                selectedMessage._id,
                "replied",
                replyText
            );

            // Update local state
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === selectedMessage._id
                        ? {
                              ...msg,
                              status: "replied",
                              adminReply: replyText,
                              repliedAt: new Date().toISOString(),
                          }
                        : msg
                )
            );

            setReplyText("");
            setIsDialogOpen(false);
            toast.success("Reply sent successfully");
        } catch (error) {
            toast.error("Failed to send reply");
        } finally {
            setIsReplying(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "unread":
                return (
                    <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700"
                    >
                        Unread
                    </Badge>
                );
            case "read":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-700"
                    >
                        Read
                    </Badge>
                );
            case "replied":
                return (
                    <Badge
                        variant="default"
                        className="bg-green-100 text-green-700"
                    >
                        Replied
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "unread":
                return <Mail className="h-4 w-4 text-red-600" />;
            case "read":
                return <Eye className="h-4 w-4 text-yellow-600" />;
            case "replied":
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Contact Messages
                </h1>
                <p className="text-gray-600">
                    Manage and respond to user inquiries
                </p>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        <Input
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredMessages.map((message) => (
                        <Card
                            key={message._id}
                            className={`cursor-pointer transition-shadow hover:shadow-md ${
                                message.status === "unread"
                                    ? "border-blue-200 bg-blue-50"
                                    : ""
                            }`}
                            onClick={() => handleMessageClick(message)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusIcon(message.status)}
                                            <h3 className="font-semibold text-lg">
                                                {message.name}
                                            </h3>
                                            {getStatusBadge(message.status)}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-4 w-4" />
                                                {message.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(
                                                    message.createdAt
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 line-clamp-2">
                                            {message.message}
                                        </p>
                                    </div>

                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredMessages.length === 0 && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No messages found
                                </h3>
                                <p className="text-gray-600">
                                    {searchTerm
                                        ? "Try adjusting your search terms"
                                        : "No contact messages to display"}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Message Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {selectedMessage?.name}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMessage?.email} •{" "}
                            {selectedMessage &&
                                new Date(
                                    selectedMessage.createdAt
                                ).toLocaleDateString()}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMessage && (
                        <div className="space-y-6">
                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    Status:
                                </span>
                                {getStatusBadge(selectedMessage.status)}
                            </div>

                            {/* Original Message */}
                            <div>
                                <h4 className="font-medium mb-2">Message:</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            {/* Previous Reply */}
                            {selectedMessage.adminReply && (
                                <div>
                                    <h4 className="font-medium mb-2">
                                        Your Reply:
                                    </h4>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="whitespace-pre-wrap">
                                            {selectedMessage.adminReply}
                                        </p>
                                        {selectedMessage.repliedAt && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Sent on{" "}
                                                {new Date(
                                                    selectedMessage.repliedAt
                                                ).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Reply Form */}
                            <div>
                                <h4 className="font-medium mb-2">
                                    {selectedMessage.status === "replied"
                                        ? "Send Follow-up Reply:"
                                        : "Send Reply:"}
                                </h4>
                                <Textarea
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                    placeholder="Type your reply here..."
                                    rows={4}
                                    className="mb-3"
                                />
                                <Button
                                    onClick={handleReply}
                                    disabled={!replyText.trim() || isReplying}
                                    className="w-full"
                                >
                                    {isReplying ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Sending Reply...
                                        </>
                                    ) : (
                                        <>
                                            <Reply className="h-4 w-4 mr-2" />
                                            Send Reply
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminContactMessages;
