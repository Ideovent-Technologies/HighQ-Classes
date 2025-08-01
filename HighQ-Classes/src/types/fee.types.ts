

export interface Payment {
    
    id: string;
    amount: number;
    date: string;
    method: 'Cash' | 'Card' | 'UPI';
    note?: string;
  }
  
  export interface FeeRecord {
    studentId: string;
    studentName: string;
    totalFees: number;
    paid: number;
    due: number;
    payments: Payment[];
  }
  