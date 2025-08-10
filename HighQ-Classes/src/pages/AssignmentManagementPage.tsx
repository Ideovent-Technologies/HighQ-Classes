import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    BookOpen,
    Plus,
    Eye,
    Edit,
    Trash2,
    Upload,
    Download,
    Calendar,
    Clock,
    Users,
    FileText,
    Star,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Filter,
    Search,
} from "lucide-react";
import { format } from "date-fns";
import AssignmentService from "@/API/services/assignmentService";
import batchService from "@/API/services/batchService";
import courseService from "@/API/services/courseService";
import {
    Assignment,
    AssignmentFormData,
    AssignmentSubmission,
    SubmissionFormData,
    AssignmentSummary,
    AssignmentFilters,
} from "@/types/assignment.types";

interface AssignmentManagementPageProps {
    userRole: "teacher" | "admin" | "student";
}

const AssignmentManagementPage: React.FC<AssignmentManagementPageProps> = ({
    userRole,
}) => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [activeTab, setActiveTab] = useState(
        userRole === "student" ? "my-assignments" : "assignments"
    );
    const [selectedAssignment, setSelectedAssignment] =
        useState<Assignment | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

    // Form states
    const [assignmentForm, setAssignmentForm] = useState<AssignmentFormData>({
        title: "",
        description: "",
        instructions: "",
        courseId: "",
        batchId: "",
        dueDate: "",
        totalMarks: 100,
        assignmentType: "homework",
        isPublished: false,
        allowLateSubmission: true,
        lateSubmissionPenalty: 10,
    });

    const [submissionForm, setSubmissionForm] = useState<SubmissionFormData>({
        submissionText: "",
    });

    // Filters
    const [filters, setFilters] = useState<AssignmentFilters>({
        status: "all",
    });

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [filters]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [coursesResult, batchesResult] = await Promise.all([
                courseService.getAllCourses(),
                batchService.getAllBatches(),
            ]);

            if (coursesResult.success && coursesResult.courses) {
                setCourses(coursesResult.courses);
            }
            if (batchesResult.success && batchesResult.batches) {
                setBatches(batchesResult.batches);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const result = await AssignmentService.getAssignments({
                ...filters,
                page: 1,
                limit: 50,
            });

            if (result.success && result.data) {
                setAssignments(result.data.assignments);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (assignmentId?: string) => {
        setLoading(true);
        try {
            const result = await AssignmentService.getSubmissions({
                assignmentId,
                page: 1,
                limit: 50,
            });

            if (result.success && result.data) {
                setSubmissions(result.data.submissions);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async () => {
        setSaving(true);
        try {
            const result = await AssignmentService.createAssignment(
                assignmentForm
            );

            if (result.success) {
                setMessage({
                    type: "success",
                    text: "Assignment created successfully!",
                });
                setIsCreateModalOpen(false);
                resetAssignmentForm();
                fetchAssignments();
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to create assignment" });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleSubmitAssignment = async () => {
        if (!selectedAssignment) return;

        setSaving(true);
        try {
            const result = await AssignmentService.submitAssignment(
                selectedAssignment._id,
                submissionForm
            );

            if (result.success) {
                setMessage({
                    type: "success",
                    text: "Assignment submitted successfully!",
                });
                setIsSubmissionModalOpen(false);
                resetSubmissionForm();
                fetchAssignments();
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to submit assignment" });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleDeleteAssignment = async (assignmentId: string) => {
        if (!confirm("Are you sure you want to delete this assignment?"))
            return;

        try {
            const result = await AssignmentService.deleteAssignment(
                assignmentId
            );

            if (result.success) {
                setMessage({
                    type: "success",
                    text: "Assignment deleted successfully!",
                });
                fetchAssignments();
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete assignment" });
        } finally {
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const resetAssignmentForm = () => {
        setAssignmentForm({
            title: "",
            description: "",
            instructions: "",
            courseId: "",
            batchId: "",
            dueDate: "",
            totalMarks: 100,
            assignmentType: "homework",
            isPublished: false,
            allowLateSubmission: true,
            lateSubmissionPenalty: 10,
        });
    };

    const resetSubmissionForm = () => {
        setSubmissionForm({
            submissionText: "",
        });
    };

    const getStatusBadge = (assignment: Assignment) => {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);

        if (!assignment.isPublished) {
            return <Badge variant="secondary">Draft</Badge>;
        }
        if (dueDate < now) {
            return <Badge variant="destructive">Overdue</Badge>;
        }
        return <Badge variant="default">Active</Badge>;
    };

    const getSubmissionStatus = (submission: AssignmentSubmission) => {
        switch (submission.status) {
            case "submitted":
                return (
                    <Badge className="bg-blue-100 text-blue-800">
                        Submitted
                    </Badge>
                );
            case "graded":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        Graded
                    </Badge>
                );
            case "returned":
                return (
                    <Badge className="bg-purple-100 text-purple-800">
                        Returned
                    </Badge>
                );
            case "late":
                return (
                    <Badge className="bg-orange-100 text-orange-800">
                        Late
                    </Badge>
                );
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const filteredAssignments = assignments.filter(
        (assignment) =>
            assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Assignment Management</h1>
                {(userRole === "teacher" || userRole === "admin") && (
                    <Dialog
                        open={isCreateModalOpen}
                        onOpenChange={setIsCreateModalOpen}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Assignment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Assignment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Title</Label>
                                        <Input
                                            id="name"
                                            value={assignmentForm.title}
                                            onChange={(e) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    title: e.target.value,
                                                })
                                            }
                                            placeholder="Assignment title..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="assignmentType">
                                            Type
                                        </Label>
                                        <Select
                                            value={
                                                assignmentForm.assignmentType
                                            }
                                            onValueChange={(value) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    assignmentType:
                                                        value as any,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="homework">
                                                    Homework
                                                </SelectItem>
                                                <SelectItem value="project">
                                                    Project
                                                </SelectItem>
                                                <SelectItem value="quiz">
                                                    Quiz
                                                </SelectItem>
                                                <SelectItem value="exam">
                                                    Exam
                                                </SelectItem>
                                                <SelectItem value="practical">
                                                    Practical
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="course">Course</Label>
                                        <Select
                                            value={assignmentForm.courseId}
                                            onValueChange={(value) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    courseId: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => (
                                                    <SelectItem
                                                        key={course._id}
                                                        value={course._id}
                                                    >
                                                        {course.courseName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="batch">Batch</Label>
                                        <Select
                                            value={assignmentForm.batchId}
                                            onValueChange={(value) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    batchId: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select batch..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {batches.map((batch) => (
                                                    <SelectItem
                                                        key={batch._id}
                                                        value={batch._id}
                                                    >
                                                        {batch.batchName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="dueDate">
                                            Due Date
                                        </Label>
                                        <Input
                                            id="dueDate"
                                            type="datetime-local"
                                            value={assignmentForm.dueDate}
                                            onChange={(e) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    dueDate: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="totalMarks">
                                            Total Marks
                                        </Label>
                                        <Input
                                            id="totalMarks"
                                            type="number"
                                            value={assignmentForm.totalMarks}
                                            onChange={(e) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    totalMarks: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={assignmentForm.description}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Assignment description..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="instructions">
                                        Instructions
                                    </Label>
                                    <Textarea
                                        id="instructions"
                                        value={assignmentForm.instructions}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                instructions: e.target.value,
                                            })
                                        }
                                        placeholder="Assignment instructions..."
                                        rows={4}
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isPublished"
                                            checked={assignmentForm.isPublished}
                                            onCheckedChange={(checked) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    isPublished: !!checked,
                                                })
                                            }
                                        />
                                        <Label htmlFor="isPublished">
                                            Publish immediately
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="allowLateSubmission"
                                            checked={
                                                assignmentForm.allowLateSubmission
                                            }
                                            onCheckedChange={(checked) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    allowLateSubmission:
                                                        !!checked,
                                                })
                                            }
                                        />
                                        <Label htmlFor="allowLateSubmission">
                                            Allow late submission
                                        </Label>
                                    </div>
                                </div>

                                {assignmentForm.allowLateSubmission && (
                                    <div>
                                        <Label htmlFor="lateSubmissionPenalty">
                                            Late Submission Penalty (%)
                                        </Label>
                                        <Input
                                            id="lateSubmissionPenalty"
                                            type="number"
                                            value={
                                                assignmentForm.lateSubmissionPenalty ||
                                                0
                                            }
                                            onChange={(e) =>
                                                setAssignmentForm({
                                                    ...assignmentForm,
                                                    lateSubmissionPenalty:
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                })
                                            }
                                            placeholder="10"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setIsCreateModalOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateAssignment}
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Creating..."
                                            : "Create Assignment"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {message && (
                <Alert
                    className={
                        message.type === "success"
                            ? "border-green-500"
                            : "border-red-500"
                    }
                >
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="assignments">
                        {userRole === "student"
                            ? "Available Assignments"
                            : "All Assignments"}
                    </TabsTrigger>
                    <TabsTrigger value="submissions">
                        {userRole === "student"
                            ? "My Submissions"
                            : "Submissions"}
                    </TabsTrigger>
                    <TabsTrigger value="grading">
                        {userRole === "student" ? "My Grades" : "Grading"}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="assignments" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    Assignments
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                        <Input
                                            placeholder="Search assignments..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-9 w-64"
                                        />
                                    </div>
                                    <Select
                                        value={filters.status}
                                        onValueChange={(
                                            value:
                                                | "all"
                                                | "published"
                                                | "draft"
                                                | "overdue"
                                        ) =>
                                            setFilters({
                                                ...filters,
                                                status: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="published">
                                                Published
                                            </SelectItem>
                                            <SelectItem value="draft">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="overdue">
                                                Overdue
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {filteredAssignments.map((assignment) => (
                                    <Card
                                        key={assignment._id}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-semibold">
                                                            {assignment.title}
                                                        </h3>
                                                        {getStatusBadge(
                                                            assignment
                                                        )}
                                                        <Badge
                                                            variant="outline"
                                                            className="capitalize"
                                                        >
                                                            {
                                                                assignment.assignmentType
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">
                                                        {assignment.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            Due:{" "}
                                                            {format(
                                                                new Date(
                                                                    assignment.dueDate
                                                                ),
                                                                "MMM dd, yyyy HH:mm"
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4" />
                                                            {
                                                                assignment.totalMarks
                                                            }{" "}
                                                            marks
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4" />
                                                            {
                                                                assignment.batch
                                                                    ?.batchName
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {userRole === "student" && (
                                                        <Dialog
                                                            open={
                                                                isSubmissionModalOpen
                                                            }
                                                            onOpenChange={
                                                                setIsSubmissionModalOpen
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        setSelectedAssignment(
                                                                            assignment
                                                                        )
                                                                    }
                                                                >
                                                                    <Upload className="h-4 w-4 mr-1" />
                                                                    Submit
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Submit
                                                                        Assignment:{" "}
                                                                        {
                                                                            assignment.title
                                                                        }
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <Label htmlFor="submissionText">
                                                                            Submission
                                                                            Text
                                                                        </Label>
                                                                        <Textarea
                                                                            id="submissionText"
                                                                            value={
                                                                                submissionForm.submissionText
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSubmissionForm(
                                                                                    {
                                                                                        ...submissionForm,
                                                                                        submissionText:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    }
                                                                                )
                                                                            }
                                                                            placeholder="Enter your submission text..."
                                                                            rows={
                                                                                6
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="attachments">
                                                                            Attachments
                                                                        </Label>
                                                                        <Input
                                                                            id="attachments"
                                                                            type="file"
                                                                            multiple
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setSubmissionForm(
                                                                                    {
                                                                                        ...submissionForm,
                                                                                        attachments:
                                                                                            Array.from(
                                                                                                e
                                                                                                    .target
                                                                                                    .files ||
                                                                                                    []
                                                                                            ),
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="flex justify-end space-x-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() =>
                                                                                setIsSubmissionModalOpen(
                                                                                    false
                                                                                )
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            onClick={
                                                                                handleSubmitAssignment
                                                                            }
                                                                            disabled={
                                                                                saving
                                                                            }
                                                                        >
                                                                            {saving
                                                                                ? "Submitting..."
                                                                                : "Submit Assignment"}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                    {(userRole === "teacher" ||
                                                        userRole ===
                                                            "admin") && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleDeleteAssignment(
                                                                        assignment._id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="submissions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Submissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-gray-500">
                                Submissions functionality will be implemented
                                here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="grading" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Grading
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-gray-500">
                                Grading functionality will be implemented here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AssignmentManagementPage;
