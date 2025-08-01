// /src/components/materials/MaterialCard.tsx
import { useContext } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { Material } from "@/types/material.types";
import AuthContext from "@/contexts/AuthContext"; 
import materialService from "@/API/services/materialService";

interface MaterialCardProps {
  material: Material;
  onDelete: (id: string) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onDelete }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.state.user;

  const handleViewAndDownload = () => {
    // Step 3: Use the user object as needed
    if (user?.role === 'student') {
      materialService.trackMaterialView(material._id);
    }
    window.open(material.fileUrl, '_blank');
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate text-lg">{material.title}</CardTitle>
        <CardDescription>Course: {material.courseId?.name || "N/A"}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {user?.role !== 'student' && (
          <Button size="sm" variant="destructive" onClick={() => onDelete(material._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" onClick={handleViewAndDownload} className="flex-grow ml-2">
          <Eye className="h-4 w-4 mr-2" />
          View / Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;