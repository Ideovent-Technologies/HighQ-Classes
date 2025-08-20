import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, User, Upload, Download } from "lucide-react";
import { format } from "date-fns";
import { Assignment, AssignmentSubmission } from "./types";
import { getAssignmentStatus } from "./StatusUtils";

interface Props {
  assignment: Assignment;
  studentId?: string;
  openSubmissionModal: (assignment: Assignment) => void;
}

const AssignmentCard: React.FC<Props> = ({ assignment, studentId, openSubmissionModal }) => {
  const { status, color } = getAssignmentStatus(assignment, studentId);
  const studentSubmission: AssignmentSubmission | undefined =
    assignment.submissions?.find((sub) => sub.student === studentId);

  return (
    <Card key={assignment._id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{assignment.name}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {assignment.subject}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {assignment.teacher.name}
              </div>
            </div>
          </div>
          <Badge className={color}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700">{assignment.description}</p>

        {/* Due Date + Marks */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>Due: {format(new Date(assignment.dueDate), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-orange-500" />
            <span>Max Marks: {assignment.totalMarks}</span>
          </div>
        </div>

        {/* Instructions */}
        {assignment.instructions && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Instructions:</h4>
            <p className="text-sm text-gray-700">{assignment.instructions}</p>
          </div>
        )}

        {/* Attachments */}
        {assignment.attachments?.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-2">Attachments:</h4>
            <div className="flex flex-wrap gap-2">
              {assignment.attachments.map((attachment, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open(attachment, "_blank")}
                >
                  <Download className="h-3 w-3 mr-1" />
                  File {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Submission Status */}
        {studentSubmission ? (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm text-blue-900">Your Submission</h4>
            <p className="text-sm text-blue-800 mb-2">
              Submitted:{" "}
              {format(new Date(studentSubmission.submittedAt), "MMM dd, yyyy 'at' HH:mm")}
            </p>
            {studentSubmission.remarks && (
              <p className="text-sm text-blue-700">
                <strong>Your remarks:</strong> {studentSubmission.remarks}
              </p>
            )}
            {studentSubmission.status === "graded" && (
              <p className="text-sm font-semibold text-green-700">
                Grade: {studentSubmission.marks}/{assignment.totalMarks}
              </p>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            {status === "overdue" ? (
              <Badge className="bg-red-100 text-red-800">Submission Deadline Passed</Badge>
            ) : (
              <Button onClick={() => openSubmissionModal(assignment)} className="flex-1">
                <Upload className="h-4 w-4 mr-2" /> Submit Assignment
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
