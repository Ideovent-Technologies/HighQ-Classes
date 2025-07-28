import Icon1 from "@/assets/featured-course/1.svg";
import Icon2 from "@/assets/featured-course/2.svg";
import Icon3 from "@/assets/featured-course/3.svg";
import Icon4 from "@/assets/featured-course/4.svg";
import CourseCarousel from "./CourseCarousel";

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mb-3">
            Our Featured Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our specialized coaching programs designed to help students excel in competitive exams.
          </p>
        </div>

        <CourseCarousel courses={courses} />
      </div>
    </section>
  );
};

export default FeaturedCourses;
