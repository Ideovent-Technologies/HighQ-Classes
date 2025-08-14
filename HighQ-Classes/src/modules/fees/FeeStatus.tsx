"use client";

import React, { useEffect, useState } from "react";
import { useFeeService } from "@/API/services/feeService";
import { FeeRecord } from "@/types/fee.types";
import FeeCard from "./FeeCard"; // adjust path if needed

const FeeStatus: React.FC = () => {
    const { getAllFees } = useFeeService(); //  call hook at top level
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            const data = await getAllFees();
            setFees(data);
            setLoading(false); //  moved inside fetchFees
        };

        fetchFees();
    }, [getAllFees]);

    if (loading) return <div className="p-4">Loading fee data...</div>;

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {fees.map((fee, index) => (
                <FeeCard
                    key={index}
                    month={"N/A"} // replace with fee.month if available
                    status={fee.due === 0 ? "Paid" : "Unpaid"}
                    amount={fee.totalFees}
                />
            ))}
        </div>
    );
};

export default FeeStatus;
