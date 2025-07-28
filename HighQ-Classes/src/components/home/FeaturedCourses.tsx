import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Proper paths using alias "@/assets/..."
import Icon1 from "@/assets/featured-course/1.svg";
import Icon2 from "@/assets/featured-course/2.svg";
import Icon3 from "@/assets/featured-course/3.svg";
import Icon4 from "@/assets/featured-course/4.svg";

const courses = [
  {
    id: 1,
    image: Icon1,
    title: "JEE Advanced Program",
    description: "Intensive training focused on cracking JEE Advanced with top ranks.",
  },
  {
    id: 2,
    image: Icon2,
    title: "NEET Coaching",
    description: "Comprehensive NEET prep with regular mock tests & analysis.",
  },
  {
    id: 3,
    image: Icon3,
    title: "WBJEE Foundation",
    description: "Early preparation with concept clarity for WBJEE aspirants.",
  },
  {
    id: 4,
    image: Icon4,
    title: "Crash Courses",
    description: "High-impact short-term programs before board & entrance exams.",
  },
];

const FeaturedCourses = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-700">
            Our Featured Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our specialized coaching programs designed to help students excel in competitive exams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6 flex flex-col justify-between h-[200px]">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-navy-700">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                <Link
                  to="/services"
                  className="inline-flex items-center text-navy-500 font-medium hover:underline mt-4"
                >
                  Learn More
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
