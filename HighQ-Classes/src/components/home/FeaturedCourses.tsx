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
  
];

const FeaturedCourses = () => {
  return (
    <section className="py-20 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-navy-700 mb-4">
            Our Featured Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our specialized coaching programs designed to help students excel in competitive exams.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
  modules={[Autoplay]}
  autoplay={{
    delay: 0, // No delay between transitions
    disableOnInteraction: false,
  }}
  loop={true}
  speed={3000} // Slow, smooth transition over 3 seconds
  spaceBetween={24}
  grabCursor={true}
  slidesPerView={1.2}
  breakpoints={{
    640: { slidesPerView: 1.2 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1280: { slidesPerView: 4 },
  }}
>

          {courses.map((course) => (
            <SwiperSlide key={course.id}>
              <div className="group bg-white/60 backdrop-blur-md border border-orange-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-[0.5deg] hover:scale-[1.03] overflow-hidden">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-contain p-6 bg-gradient-to-br from-orange-50 to-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 h-[220px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-navy-700 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-orange-600 font-medium hover:underline mt-4"
                  >
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
