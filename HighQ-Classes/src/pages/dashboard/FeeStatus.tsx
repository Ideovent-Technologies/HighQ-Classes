"use client";

import { useEffect, useState } from "react";
import { useFeeService } from "@/API/services/feeService"; //  using the hook
import { FeeRecord } from "@/types/fee.types";
import StudentFeeTable from "@/modules/fees/StudentFeeTable";

export default function FeeStatus() {
    const { getAllFees } = useFeeService(); //  Call the hook here
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const data = await getAllFees(); //  Now works
                setFees(data);
                console.log("Fetched fees:", data);
            } catch (error) {
                console.error("Failed to load fees:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, [getAllFees]); //  include in deps

    if (loading) return <div className="p-6">Loading fee data...</div>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Fee Management (Admin)</h1>
            <StudentFeeTable records={fees} />
        </div>
    );
}
