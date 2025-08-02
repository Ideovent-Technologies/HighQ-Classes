import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeacherUser } from "@/types/teacher.types";

interface TeacherCardProps {
    teacher: TeacherUser;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
    return (
        <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={teacher.profilePicture} alt={teacher.name} />
                    <AvatarFallback className="text-xl">{teacher.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{teacher.name}</h3>
                <p className="text-sm text-gray-600">{teacher.department}</p>
                {/* Removed Employee ID line */}
                <Link to={`/dashboard/teachers/${teacher._id}`} className="mt-4">
                    <Button size="sm">View Profile</Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default TeacherCard;