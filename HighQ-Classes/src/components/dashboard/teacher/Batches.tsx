import React, { useState } from "react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
    Users,
    CalendarDays,
    BookOpen,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";

const shimmer =
    "hover:before:opacity-100 before:opacity-0 before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-white/30 before:to-transparent before:blur-lg before:transition-opacity before:duration-700 before:pointer-events-none";

const Batches = () => {
    const { data, loading, error } = useTeacherDashboard();
    const [expandedBatchIds, setExpandedBatchIds] = useState<string[]>([]);

    if (loading)
        return (
            <div className="p-10 text-center text-gray-500">
                Loading batches...
            </div>
        );
    if (error)
        return (
            <div className="p-10 text-center text-red-500">
                Error loading data
            </div>
        );
    if (!data || !data.assignedBatches)
        return (
            <div className="p-10 text-center text-gray-400">
                No batches assigned.
            </div>
        );

    const { assignedBatches, assignedStudents } = data;

    const toggleExpand = (batchId: string) => {
        setExpandedBatchIds((prev) =>
            prev.includes(batchId)
                ? prev.filter((id) => id !== batchId)
                : [...prev, batchId]
        );
    };

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-[#e6f0ff] via-[#dbeafe] to-[#c7d2fe]">
            {/* Heading */}
            <h1 className="text-5xl font-extrabold text-center text-gradient bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg flex items-center justify-center gap-3 mb-10">
                <BookOpen className="w-10 h-10 text-indigo-400 animate-pulse" />
                Teacher’s Assigned Batches
            </h1>

            {/* Batches Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {assignedBatches.map((batch) => {
                    const students = Array.isArray(
                        assignedStudents?.[batch.name]
                    )
                        ? assignedStudents[batch.name]
                        : [];
                    const isExpanded = expandedBatchIds.includes(batch._id);

                    return (
                        <motion.div
                            key={batch._id}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className={`relative group rounded-3xl bg-gray-900/60 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition-all overflow-hidden ${shimmer}`}
                        >
                            <CardContent className="p-6 space-y-6 relative z-10">
                                {/* Title & Badge */}
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-white drop-shadow-sm">
                                        {batch.name}
                                    </h3>
                                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow px-3 py-1 text-sm rounded-full">
                                        {/* FIX: Show course name robustly */}
                                        {/* MODIFICATION: Directly access the 'course' property */}
                                        {batch.course || "Unknown Course"}
                                    </Badge>
                                </div>

                                {/* Dates */}
                                <div className="flex items-center gap-2 text-sm text-slate-100">
                                    <CalendarDays className="w-4 h-4 text-blue-200" />
                                    {batch.startDate && batch.endDate ? (
                                        <>
                                            {format(
                                                new Date(batch.startDate),
                                                "PP"
                                            )}{" "}
                                            –{" "}
                                            {format(
                                                new Date(batch.endDate),
                                                "PP"
                                            )}
                                        </>
                                    ) : (
                                        <span className="italic text-red-300">
                                            Date not set
                                        </span>
                                    )}
                                </div>

                                {/* Students */}
                                <div>
                                    <p className="flex items-center gap-2 text-sm text-indigo-100 font-semibold mb-2">
                                        <Users className="w-4 h-4 text-indigo-200" />
                                        {students.length} Student
                                        {students.length !== 1 && "s"}
                                    </p>

                                    <ul className="text-sm text-white space-y-1 max-h-32 overflow-y-auto pl-3 pr-1 scrollbar-thin scrollbar-thumb-blue-300/60 scrollbar-track-transparent">
                                        {(isExpanded
                                            ? students
                                            : students.slice(0, 3)
                                        ).map((student) => (
                                            <li
                                                key={student._id}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="w-6 h-6 bg-indigo-600 text-white text-xs font-bold flex items-center justify-center rounded-full shadow">
                                                    {student.name?.[0]?.toUpperCase() ||
                                                        "?"}
                                                </div>
                                                <span className="truncate font-medium text-white">
                                                    {student.name}
                                                </span>
                                                <span className="text-xs text-slate-200 ml-1 truncate">
                                                    ({student.email})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Expand/Collapse Button */}
                                    {students.length > 3 && (
                                        <button
                                            onClick={() =>
                                                toggleExpand(batch._id)
                                            }
                                            className="mt-3 inline-flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full shadow hover:brightness-110 transition-all"
                                        >
                                            {isExpanded ? (
                                                <>
                                                    Show Less{" "}
                                                    <ChevronUp className="w-4 h-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Show All ({students.length}){" "}
                                                    <ChevronDown className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </CardContent>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Batches;