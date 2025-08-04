import React from "react";
import { TeacherUser } from "@/types/teacher.types"; // Using the provided interface
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data that now conforms to the TeacherUser interface
const mockTeachers: TeacherUser[] = [
    { 
        _id: "T101", 
        name: "Dr. Anjali Sharma", 
       
        email: "anjali.s@example.com", 
        department: "Physics", 
        qualification: "Ph.D. in Physics",
        experience: 10,
        specialization: "Quantum Mechanics",
        role: "teacher",
        status: "active",
        mobile: "9876543210"
    },
    { 
        _id: "T102", 
        name: "Mr. Vikram Singh", 
        
        email: "vikram.s@example.com", 
        department: "Chemistry", 
        qualification: "M.Sc. Chemistry",
        experience: 8,
        specialization: "Organic Chemistry",
        role: "teacher",
        status: "active",
        mobile: "9876512345"
    },
    { 
        _id: "T103", 
        name: "Ms. Priya Reddy", 
       
        email: "priya.r@example.com", 
        department: "Mathematics", 
        qualification: "M.Sc. Mathematics",
        experience: 5,
        specialization: "Calculus",
        role: "teacher",
        status: "on-leave",
        mobile: "9988776655"
    },
];

interface TeacherListProps {
    teachers: TeacherUser[];
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers = mockTeachers }) => {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
                <TableCaption>A list of all registered teachers.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.map(teacher => (
                        <TableRow key={teacher._id}>
                            <TableCell className="font-medium">{teacher.name}</TableCell>
                          
                            <TableCell>{teacher.email}</TableCell>
                            <TableCell>{teacher.department}</TableCell>
                            <TableCell className="text-right">
                                <Link to={`/dashboard/teachers/${teacher._id}`}>
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TeacherList;