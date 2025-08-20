import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, X, File, Loader2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md mx-auto rounded-xl shadow-2xl animate-scale-up-center border-gray-200">
        <CardHeader className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Submit Assignment</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-base text-gray-600 mt-1">{assignment.name}</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-semibold text-gray-800 block">
              Upload File <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-2">
                Accepted formats: PDF, DOC, DOCX, TXT, ZIP
              </p>
            </div>
            {file && (
              <div className="flex items-center p-2 mt-2 bg-gray-100 rounded-lg text-sm text-gray-700">
                <File className="h-4 w-4 mr-2 text-blue-500" />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="remarks" className="text-sm font-semibold text-gray-800 block">
              Remarks (Optional)
            </label>
            <Textarea
              id="remarks"
              placeholder="Add any remarks or comments for your teacher..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!file || submitting}
              className="flex-1 h-11 text-base font-semibold transition-all duration-300 transform hover:scale-[1.01] bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Submit
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionModal;