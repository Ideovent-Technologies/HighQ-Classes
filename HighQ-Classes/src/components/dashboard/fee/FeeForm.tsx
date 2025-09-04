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

// Define the payload shape clearly instead of using `any`
export interface CreateFeeData {
  studentId?: string;
  courseId?: string;
  batchId?: string;
  amount: number;
  dueDate: string;
  feeType: "admission" | "tuition" | "examination" | "other";
  month?: string;
  year: number;
  description?: string;
}

interface CreateFeeFormProps {
  onSubmit: (data: CreateFeeData) => void;
  onCancel: () => void;
}

const CreateFeeForm: React.FC<CreateFeeFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    batchId: "",
    amount: "",
    dueDate: "",
    feeType: "tuition" as CreateFeeData["feeType"],
    month: "",
    year: new Date().getFullYear(),
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateFeeData = {
      amount: formData.amount ? parseFloat(formData.amount) : 0,
      dueDate: formData.dueDate,
      feeType: formData.feeType,
      year: formData.year,
      description: formData.description.trim() || undefined,
    };

    if (formData.studentId.trim()) payload.studentId = formData.studentId.trim();
    if (formData.courseId.trim()) payload.courseId = formData.courseId.trim();
    if (formData.batchId.trim()) payload.batchId = formData.batchId.trim();
    if (formData.month.trim()) payload.month = formData.month.trim();

    onSubmit(payload);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Create New Fee</DialogTitle>
        <DialogDescription>
          Create a fee record (student, course & batch are optional)
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* Student ID */}
        <div>
          <Label htmlFor="studentId">Student ID (optional)</Label>
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, studentId: e.target.value }))
            }
            placeholder="Leave empty for general fee"
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
            onValueChange={(value: CreateFeeData["feeType"]) =>
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
          <Button type="submit">Create Fee</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFeeForm;
