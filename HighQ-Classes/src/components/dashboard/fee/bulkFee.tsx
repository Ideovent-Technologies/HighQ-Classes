import React, { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BulkFeeData {
  studentIds?: string[];
  courseId?: string;
  batchId?: string;
  amount: number;
  dueDate: string;
  feeType: "admission" | "tuition" | "examination" | "other";
  month?: string;
  year: number;
  description?: string;
}

interface BulkFeeFormProps {
  onSubmit: (data: BulkFeeData) => void;
  onCancel: () => void;
}

const BulkFeeForm: React.FC<BulkFeeFormProps> = ({ onSubmit, onCancel }) => {
  // typed state instead of mixing strings/numbers
  const [formData, setFormData] = useState({
    studentIds: "",
    courseId: "",
    batchId: "",
    amount: "", // keep as string for input
    dueDate: "",
    feeType: "tuition" as BulkFeeData["feeType"],
    month: "",
    year: new Date().getFullYear(),
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const studentIdsArray = formData.studentIds
      ? formData.studentIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

    const payload: BulkFeeData = {
      studentIds: studentIdsArray.length > 0 ? studentIdsArray : undefined,
      courseId: formData.courseId.trim() || undefined,
      batchId: formData.batchId.trim() || undefined,
      amount: formData.amount ? parseFloat(formData.amount) : 0,
      dueDate: formData.dueDate,
      feeType: formData.feeType,
      month: formData.month.trim() || undefined,
      year: formData.year,
      description: formData.description.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Create Bulk Fees</DialogTitle>
        <DialogDescription>
          Create fee records for multiple students or a general fee
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Student IDs */}
        <div>
          <Label htmlFor="studentIds">
            Student IDs (comma-separated, optional)
          </Label>
          <Textarea
            id="studentIds"
            value={formData.studentIds}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, studentIds: e.target.value }))
            }
            placeholder="student1, student2... (leave empty for general fee)"
          />
        </div>

        {/* Course ID */}
        <div>
          <Label htmlFor="courseId">Course ID (optional)</Label>
          <Input
            id="courseId"
            value={formData.courseId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, courseId: e.target.value }))
            }
            placeholder="Leave empty if not linked"
          />
        </div>

        {/* Batch ID */}
        <div>
          <Label htmlFor="batchId">Batch ID (optional)</Label>
          <Input
            id="batchId"
            value={formData.batchId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, batchId: e.target.value }))
            }
            placeholder="Leave empty if not linked"
          />
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            required
          />
        </div>

        {/* Fee Type */}
        <div>
          <Label htmlFor="feeType">Fee Type</Label>
          <Select
            value={formData.feeType}
            onValueChange={(value: BulkFeeData["feeType"]) =>
              setFormData((prev) => ({ ...prev, feeType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fee type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admission">Admission</SelectItem>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="examination">Examination</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit">Create Bulk Fees</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BulkFeeForm;
