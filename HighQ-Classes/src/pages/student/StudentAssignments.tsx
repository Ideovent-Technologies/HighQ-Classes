import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileText,
    Upload,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Download,
    Eye,
    User,
    BookOpen,
    GraduationCap,
    Send,
    X,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface Assignment {
    _id: string;
    name: string;
    description: string;
    subject: string;
    batch: {
        _id: string;
        name: string;
    };
    course: {
        _id: string;
        name: string;
    };
    attachments: string[];
    dueDate: string;
    totalMarks: number;
    instructions: string;
    teacher: {
        _id: string;
        name: string;
    };
    createdAt: string;
    isActive: boolean;
    submissions?: AssignmentSubmission[];
}

interface AssignmentSubmission {
    _id: string;
    student: string;
    assignment: string;
    submissionFile: string;
    submittedAt: string;
    remarks?: string;
    status: "submitted" | "graded" | "late";
    marks?: number;
    feedback?: string;
    gradedAt?: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    assignments?: Assignment[];
    assignment?: Assignment;
    submission?: AssignmentSubmission;
}

const StudentAssignments: React.FC = () => {
    const { state } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submissionModal, setSubmissionModal] = useState<{
        open: boolean;
        assignment: Assignment | null;
    }>({ open: false, assignment: null });
    const [submissionForm, setSubmissionForm] = useState({
        file: null as File | null,
        remarks: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            setError(null);

            // Directly fetch assignments - the backend filters by authenticated student's batch
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/assignments`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const data: ApiResponse = await response.json();

            if (data.success && data.assignments) {
                setAssignments(data.assignments);
            } else {
                throw new Error(data.message || "Failed to fetch assignments");
            }
        } catch (err: any) {
            console.error("Assignments fetch error:", err);
            setError(err.message || "Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAssignment = async () => {
        if (!submissionModal.assignment || !submissionForm.file) {
            setError("Please select a file to submit");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const formData = new FormData();
            formData.append("file", submissionForm.file);
            if (submissionForm.remarks) {
                formData.append("remarks", submissionForm.remarks);
            }

            const token = localStorage.getItem("authToken");
            const response = await fetch(
                `/api/assignments/${submissionModal.assignment._id}/submit`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: formData,
                }
            );

            const data: ApiResponse = await response.json();

            if (data.success) {
                // Refresh assignments to get updated submission status
                await fetchAssignments();
                setSubmissionModal({ open: false, assignment: null });
                setSubmissionForm({ file: null, remarks: "" });
                setError("Assignment submitted successfully!");
                setTimeout(() => setError(null), 3000);
            } else {
                throw new Error(data.message || "Failed to submit assignment");
            }
        } catch (err: any) {
            console.error("Assignment submission error:", err);
            setError(err.message || "Failed to submit assignment");
        } finally {
            setSubmitting(false);
        }
    };

    const getAssignmentStatus = (assignment: Assignment) => {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        const studentSubmission = assignment.submissions?.find(
            (sub) => sub.student === state.user?._id
        );

        if (studentSubmission) {
            if (studentSubmission.status === "graded") {
                return {
                    status: "graded",
                    color: "bg-green-100 text-green-800",
                };
            }
            return { status: "submitted", color: "bg-blue-100 text-blue-800" };
        }

        if (now > dueDate) {
            return { status: "overdue", color: "bg-red-100 text-red-800" };
        }

        return { status: "pending", color: "bg-yellow-100 text-yellow-800" };
    };

    const filteredAssignments = assignments.filter((assignment) => {
        if (filterStatus === "all") return true;
        const { status } = getAssignmentStatus(assignment);
        return status === filterStatus;
    });

    const openSubmissionModal = (assignment: Assignment) => {
        setSubmissionModal({ open: true, assignment });
        setSubmissionForm({ file: null, remarks: "" });
        setError(null);
    };

    const closeSubmissionModal = () => {
        setSubmissionModal({ open: false, assignment: null });
        setSubmissionForm({ file: null, remarks: "" });
        setError(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Assignments
                        </h1>
                        <p className="text-gray-600">
                            View and submit your assignments
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                    {assignments.length} Total Assignments
                </Badge>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert
                    className={
                        error.includes("successfully") ? "border-green-500" : ""
                    }
                >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Filter Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger
                        value="all"
                        onClick={() => setFilterStatus("all")}
                    >
                        All
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending"
                        onClick={() => setFilterStatus("pending")}
                    >
                        Pending
                    </TabsTrigger>
                    <TabsTrigger
                        value="submitted"
                        onClick={() => setFilterStatus("submitted")}
                    >
                        Submitted
                    </TabsTrigger>
                    <TabsTrigger
                        value="graded"
                        onClick={() => setFilterStatus("graded")}
                    >
                        Graded
                    </TabsTrigger>
                    <TabsTrigger
                        value="overdue"
                        onClick={() => setFilterStatus("overdue")}
                    >
                        Overdue
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filterStatus} className="mt-6">
                    {filteredAssignments.length === 0 ? (
                        <Card className="text-center py-12">
                            <CardContent>
                                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Assignments Found
                                </h3>
                                <p className="text-gray-600">
                                    {filterStatus === "all"
                                        ? "No assignments have been assigned yet."
                                        : `No ${filterStatus} assignments found.`}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredAssignments.map((assignment) => {
                                const { status, color } =
                                    getAssignmentStatus(assignment);
                                const studentSubmission =
                                    assignment.submissions?.find(
                                        (sub) => sub.student === state.user?._id
                                    );

                                return (
                                    <Card
                                        key={assignment._id}
                                        className="hover:shadow-lg transition-shadow"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl mb-2">
                                                        {assignment.name}
                                                    </CardTitle>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                        <div className="flex items-center">
                                                            <BookOpen className="h-4 w-4 mr-1" />
                                                            {assignment.subject}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <User className="h-4 w-4 mr-1" />
                                                            {
                                                                assignment
                                                                    .teacher
                                                                    .name
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className={color}>
                                                    {status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        status.slice(1)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-gray-700">
                                                {assignment.description}
                                            </p>

                                            {/* Assignment Details */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                                    <span>
                                                        Due:{" "}
                                                        {format(
                                                            new Date(
                                                                assignment.dueDate
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                                                    <span>
                                                        Max Marks:{" "}
                                                        {assignment.totalMarks}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Instructions */}
                                            {assignment.instructions && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                                        Instructions:
                                                    </h4>
                                                    <p className="text-sm text-gray-700">
                                                        {
                                                            assignment.instructions
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {/* Attachments */}
                                            {assignment.attachments &&
                                                assignment.attachments.length >
                                                    0 && (
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                                            Attachments:
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {assignment.attachments.map(
                                                                (
                                                                    attachment,
                                                                    index
                                                                ) => (
                                                                    <Button
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="text-xs"
                                                                        onClick={() =>
                                                                            window.open(
                                                                                attachment,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                    >
                                                                        <Download className="h-3 w-3 mr-1" />
                                                                        File{" "}
                                                                        {index +
                                                                            1}
                                                                    </Button>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Submission Status */}
                                            {studentSubmission ? (
                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-sm text-blue-900">
                                                            Your Submission
                                                        </h4>
                                                        <Badge variant="secondary">
                                                            {
                                                                studentSubmission.status
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-blue-800 mb-2">
                                                        Submitted:{" "}
                                                        {format(
                                                            new Date(
                                                                studentSubmission.submittedAt
                                                            ),
                                                            "MMM dd, yyyy 'at' HH:mm"
                                                        )}
                                                    </p>
                                                    {studentSubmission.remarks && (
                                                        <p className="text-sm text-blue-700 mb-2">
                                                            <strong>
                                                                Your remarks:
                                                            </strong>{" "}
                                                            {
                                                                studentSubmission.remarks
                                                            }
                                                        </p>
                                                    )}
                                                    {studentSubmission.status ===
                                                        "graded" && (
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-semibold text-green-700">
                                                                Grade:{" "}
                                                                {
                                                                    studentSubmission.marks
                                                                }
                                                                /
                                                                {
                                                                    assignment.totalMarks
                                                                }
                                                            </p>
                                                            {studentSubmission.feedback && (
                                                                <p className="text-sm text-green-600">
                                                                    <strong>
                                                                        Feedback:
                                                                    </strong>{" "}
                                                                    {
                                                                        studentSubmission.feedback
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    {status === "overdue" ? (
                                                        <Badge className="bg-red-100 text-red-800">
                                                            Submission Deadline
                                                            Passed
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            onClick={() =>
                                                                openSubmissionModal(
                                                                    assignment
                                                                )
                                                            }
                                                            className="flex-1"
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Submit Assignment
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Submission Modal */}
            {submissionModal.open && submissionModal.assignment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Submit Assignment</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={closeSubmissionModal}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                                {submissionModal.assignment.name}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Upload File *
                                </label>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt,.zip"
                                    onChange={(e) => {
                                        const file =
                                            e.target.files?.[0] || null;
                                        setSubmissionForm((prev) => ({
                                            ...prev,
                                            file,
                                        }));
                                    }}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Accepted formats: PDF, DOC, DOCX, TXT, ZIP
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Remarks (Optional)
                                </label>
                                <Textarea
                                    placeholder="Add any remarks about your submission..."
                                    value={submissionForm.remarks}
                                    onChange={(e) =>
                                        setSubmissionForm((prev) => ({
                                            ...prev,
                                            remarks: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={closeSubmissionModal}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitAssignment}
                                    disabled={
                                        !submissionForm.file || submitting
                                    }
                                    className="flex-1"
                                >
                                    {submitting ? (
                                        "Submitting..."
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Submit
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default StudentAssignments;
