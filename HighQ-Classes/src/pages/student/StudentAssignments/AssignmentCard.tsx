import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  Upload,
  Download,
  CheckCircle,
  Hourglass,
  XCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { Assignment, AssignmentSubmission } from "./types";
import { getAssignmentStatus } from "./StatusUtils";

interface Props {
  assignment: Assignment;
  studentId?: string;
  openSubmissionModal: (assignment: Assignment) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "graded":
      return {
        text: "Graded",
        icon: <CheckCircle className="h-4 w-4 mr-1.5" />,
        className: "bg-emerald-100 text-emerald-800 border border-emerald-300",
      };
    case "submitted":
      return {
        text: "Submitted",
        icon: <CheckCircle className="h-4 w-4 mr-1.5" />,
        className: "bg-blue-100 text-blue-800 border border-blue-300",
      };
    case "overdue":
      return {
        text: "Overdue",
        icon: <XCircle className="h-4 w-4 mr-1.5" />,
        className: "bg-red-100 text-red-800 border border-red-300",
      };
    case "pending":
    default:
      return {
        text: "Pending",
        icon: <Hourglass className="h-4 w-4 mr-1.5" />,
        className: "bg-amber-100 text-amber-800 border border-amber-300",
      };
  }
};

const AssignmentCard: React.FC<Props> = ({
  assignment,
  studentId,
  openSubmissionModal,
}) => {
  const { status } = getAssignmentStatus(assignment, studentId);
  const studentSubmission: AssignmentSubmission | undefined =
    assignment.submissions?.find((sub) => sub.student === studentId);
  const statusBadge = getStatusBadge(status);

  return (
    <Card className="flex flex-col h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group">
      {/* HEADER */}
      <CardHeader className="p-6 md:p-7 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 rounded-t-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-2xl lg:text-3xl font-extrabold text-gray-800 leading-tight mb-1 flex items-center">
              {assignment.name}
              {status === "pending" && (
                <Sparkles className="inline h-5 w-5 ml-2 text-yellow-500 animate-bounce" />
              )}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mt-2 font-medium">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                <span>{assignment.subject}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-purple-600" />
                <span>{assignment?.teacher?.name ?? "Unknown Teacher"}</span>
              </div>
            </div>
          </div>
          <Badge
            className={`px-4 py-2 text-sm font-semibold rounded-full min-w-[110px] text-center flex items-center justify-center shadow-sm ${statusBadge.className}`}
          >
            {statusBadge.icon}
            {statusBadge.text}
          </Badge>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="flex-1 flex flex-col justify-between p-6 md:p-7 space-y-6">
        <div className="space-y-5">
          <p className="text-gray-700 leading-relaxed text-base font-medium">
            {assignment.description}
          </p>

          {/* Due date + Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-gray-700">
            <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-orange-50 transition">
              <Calendar className="h-4 w-4 mr-2.5 text-orange-500" />
              <span>
                Due Date:{" "}
                <span className="text-gray-900 font-bold">
                  {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
                </span>
              </span>
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-teal-50 transition">
              <Clock className="h-4 w-4 mr-2.5 text-teal-500" />
              <span>
                Max Marks:{" "}
                <span className="text-gray-900 font-bold">
                  {assignment.totalMarks}
                </span>
              </span>
            </div>
          </div>

          {/* Instructions */}
          {assignment.instructions && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <h4 className="font-bold text-sm text-blue-800 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Instructions
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                {assignment.instructions}
              </p>
            </div>
          )}

          {/* Attachments */}
          {assignment.attachments?.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-base">
                Attachments ({assignment.attachments.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {assignment.attachments.map((attachment, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors rounded-full px-4 py-2 flex items-center shadow-sm"
                    onClick={() => window.open(attachment, "_blank")}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    File {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SUBMISSION */}
        {studentSubmission ? (
          <div className="mt-6 bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-inner">
            <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> Your Submission
            </h4>
            <div className="space-y-1 text-sm text-emerald-700">
              <p>
                Submitted on:{" "}
                <span className="font-semibold">
                  {format(
                    new Date(studentSubmission.submittedAt),
                    "MMM dd, yyyy 'at' HH:mm"
                  )}
                </span>
              </p>
              {studentSubmission.remarks && (
                <p>
                  <strong className="text-emerald-900">Remarks:</strong>{" "}
                  {studentSubmission.remarks}
                </p>
              )}
              {studentSubmission.status === "graded" && (
                <p className="font-bold text-emerald-900 text-base mt-2">
                  Grade: {studentSubmission.marks}/{assignment.totalMarks}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {status === "overdue" ? (
              <Badge className="bg-red-50 text-red-700 font-bold px-4 py-3 text-sm rounded-lg w-full flex items-center justify-center shadow-inner">
                <XCircle className="h-5 w-5 mr-2" />
                Submission Deadline Passed
              </Badge>
            ) : (
              <Button
                onClick={() => openSubmissionModal(assignment)}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.01] rounded-lg animate-pulse-once"
              >
                <Upload className="h-5 w-5 mr-2" /> Submit Assignment
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
