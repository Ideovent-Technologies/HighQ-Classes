import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";

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
  {
    id: 5,
    image: Icon1,
    title: "CUET Preparation",
    description: "Focused CUET training with section-wise practice and tips.",
  },
  {
    id: 6,
    image: Icon2,
    title: "Class 11 Science Bridge",
    description: "Strengthen basics and bridge the gap for Class 11 Science students.",
  },
  {
    id: 7,
    image: Icon3,
    title: "Foundation Batch (8-10)",
    description: "Early start for IIT/NEET with concept-building for grades 8 to 10.",
  },
  {
    id: 8,
    image: Icon4,
    title: "Revision & Test Series",
    description: "Rigorous revision batches with full-length tests and discussions.",
  },
];


const FeaturedCourses = () => {
  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text mb-5 tracking-tight drop-shadow-md animate-gradient-x">
            Our Featured Programs
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Discover our specialized coaching programs designed to help students excel in competitive exams with confidence and clarity.
          </p>
          <div className="relative mt-6 flex justify-center">
            <div className="w-36 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          grabCursor={true}
          spaceBetween={24}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {courses.map((course) => (
            <SwiperSlide key={course.id}>
              <div className="group bg-white/60 backdrop-blur-lg border border-orange-100 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.03] hover:rotate-[0.3deg] overflow-hidden relative">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-contain p-6 bg-gradient-to-br from-orange-50 to-white scale-90 group-hover:scale-100 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 h-[220px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-navy-700 mb-2 group-hover:text-orange-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {course.description}
                    </p>
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-orange-600 font-medium mt-4 group/link"
                  >
                    <span className="relative after:block after:absolute after:h-[2px] after:bg-orange-400 after:w-0 group-hover/link:after:w-full after:transition-all after:duration-300">
                      Learn More
                    </span>
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCourses;
