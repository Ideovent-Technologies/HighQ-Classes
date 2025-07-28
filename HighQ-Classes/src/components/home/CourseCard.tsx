import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  image: string;
  title: string;
  description: string;
}

const CourseCard = ({ image, title, description }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-300 group overflow-hidden cursor-pointer">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6 h-[200px] flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-navy-700 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center text-navy-500 font-medium hover:underline mt-4"
        >
          Learn More
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};


export default CourseCard;
