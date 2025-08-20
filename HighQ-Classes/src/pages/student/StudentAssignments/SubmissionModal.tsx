import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { Assignment } from "./types";

interface Props {
  assignment: Assignment;
  file: File | null;
  remarks: string;
  setFile: (file: File | null) => void;
  setRemarks: (remarks: string) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const SubmissionModal: React.FC<Props> = ({
  assignment,
  file,
  remarks,
  setFile,
  setRemarks,
  submitting,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Submit Assignment</CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">{assignment.name}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload File *
            </label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.zip"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
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
              placeholder="Add any remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!file || submitting} className="flex-1">
              {submitting ? "Submitting..." : <><Send className="h-4 w-4 mr-2" /> Submit</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionModal;
