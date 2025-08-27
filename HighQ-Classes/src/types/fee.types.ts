

export interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'online' | 'other';
  transactionId?: string;
  receiptNumber?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  processedBy?: {
    id: string;
    name: string;
  };
}

export interface Fee {
  id: string;
  student: {
    id: string;
    name: string;
    email?: string;
    mobile?: string;
  };
  course?: {
    id: string;
    name: string;
  };
  batch?: {
    id: string;
    name: string;
  };
  feeType: 'admission' | 'tuition' | 'examination' | 'other';
  amount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  month?: string;
  year?: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  description?: string;
  discount: number;
  lateCharge: number;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface FeeRecord {
  studentId: string;
  studentName: string;
  totalFees: number;
  paid: number;
  due: number;
  payments: Payment[];
}

export interface FeeSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  upcomingAmount: number;
}

export interface FeeAnalytics {
  overview: {
    totalFees: number;
    totalPaid: number;
    totalPending: number;
    totalRecords: number;
    overdueAmount: number;
    overdueCount: number;
    monthlyCollection: number;
    monthlyTransactions: number;
  };
  feeTypeDistribution: Array<{
    _id: string;
    count: number;
    totalAmount: number;
    paidAmount: number;
  }>;
}

export interface BulkFeeData {
  studentIds: string[];
  courseId?: string;
  batchId?: string;
  amount: number;
  dueDate: string;
  feeType: 'admission' | 'tuition' | 'examination' | 'other';
  month?: string;
  year?: number;
  description?: string;
}

export interface PaymentData {
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'online' | 'other';
  transactionId?: string;
  paymentDate?: string;
  remarks?: string;
}

export interface ReceiptData {
  receiptNumber: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  student: {
    name: string;
    email: string;
    mobile: string;
  };
  fee: {
    type: string;
    description?: string;
    course?: string;
    batch?: string;
    month?: string;
    year?: number;
  };
  processedBy: string;
  notes?: string;
}
  