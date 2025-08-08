import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    Building,
    Settings,
    Plus,
    DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionsProps {
    className?: string;
}

const actions = [
    { label: "Manage Teachers", icon: Plus, to: "/dashboard/teachers/manage" },
    { label: "Manage Courses", icon: BookOpen, to: "/dashboard/courses/manage" },
    { label: "Manage Batches", icon: Building, to: "/dashboard/batches/manage" },
    { label: "Manage Fees", icon: DollarSign, to: "/dashboard/fee-management" },
    { label: "Manage Students", icon: Users, to: "/dashboard/student/add" },
    { label: "Settings", icon: Settings, to: "/dashboard/settings" },
];

const ActionButton: React.FC<{
    to: string;
    label: string;
    icon: React.ElementType;
}> = ({ to, label, icon: Icon }) => (
    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
        <Link to={to} aria-label={label} className="block">
            <Button
                variant="outline"
                className={`
                    min-h-[110px] sm:min-h-[130px]
                    w-full
                    flex flex-col items-center justify-center gap-3
                    rounded-2xl
                    border border-gray-300
                    bg-gradient-to-tr from-blue-50 via-white to-green-50
                    hover:bg-gradient-to-tr hover:from-blue-100 hover:via-white hover:to-green-100
                    text-indigo-600
                    transition-all shadow-md
                    min-w-0
                `}
            >
                <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
                <span className="text-sm font-semibold text-center text-indigo-700 whitespace-normal inline-block">
                    {label}
                </span>
            </Button>
        </Link>
    </motion.div>
);

const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
    return (
        <Card
            className={`
                bg-gradient-to-br from-blue-50 to-green-50
                border border-blue-200
                shadow-lg shadow-blue-100/60
                rounded-3xl
                p-6 sm:p-8
                ${className}
            `}
        >
            <CardHeader>
                <CardTitle className="text-xl font-bold text-indigo-900">
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {actions.map((action) => (
                        <ActionButton
                            key={action.to}
                            to={action.to}
                            label={action.label}
                            icon={action.icon}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
