import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";

import Thumb1 from "@/assets/featured-course/1.svg"; // Replace with real thumbnail images
import Thumb2 from "@/assets/featured-course/2.svg";
import Thumb3 from "@/assets/featured-course/3.svg";
import Thumb4 from "@/assets/featured-course/4.svg";

const featuredCourses = [
  {
    tab: "foundation",
    image: Thumb1,
    title: "Foundation Batch (8–10)",
    description: "Start early with IIT/NEET concepts for classes 8–10.",
  },
  {
    tab: "classroom",
    image: Thumb2,
    title: "Classroom Coaching",
    description: "Engaging offline sessions with top mentors and doubt solving.",
  },
  {
    tab: "online",
    image: Thumb3,
    title: "Live Online Batches",
    description: "Join live interactive online classes from anywhere.",
  },
  {
    tab: "doubt",
    image: Thumb4,
    title: "Doubt Solving Support",
    description: "Get your doubts resolved by subject experts 24/7.",
  },
  {
    tab: "testprep",
    image: Thumb1,
    title: "Test Series & Analytics",
    description: "Mock tests with performance tracking & analysis.",
  },
  {
    tab: "crashcourse",
    image: Thumb2,
    title: "Crash Courses",
    description: "Quick revision boosters for boards & entrances.",
  },
  {
    tab: "boardsupport",
    image: Thumb3,
    title: "Board Exam Support",
    description: "Subject-wise guidance for CBSE, ICSE & state boards.",
  },
  {
    tab: "ntse",
    image: Thumb4,
    title: "NTSE & KVPY Prep",
    description: "Special mentoring for NTSE, KVPY & talent exams.",
  },
  {
    tab: "jee",
    image: Thumb1,
    title: "JEE Advanced Program",
    description: "Elite batch for top JEE aspirants with focused mentoring.",
  },
  {
    tab: "olympiad",
    image: Thumb2,
    title: "Olympiad Training",
    description: "Rigorous prep for NSO, IMO, IJSO & more.",
  },
];

const FeaturedCourses = () => {
  return (
    <section className="py-28 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-transparent bg-clip-text mb-4 animate-gradient-x drop-shadow-xl">
            Our Featured Programs
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Crafted learning journeys from the best academic mentors — explore the right path for your future.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-36 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Course Carousel */}
        <Swiper
          modules={[Autoplay]}
          loop
          grabCursor
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
          {featuredCourses.map((course, i) => (
            <SwiperSlide key={i}>
              <div className="group relative bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                
                {/* Image Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 group-hover:opacity-90 transition" />
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col justify-between h-[240px]">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/services?tab=${course.tab}`}
                      className="text-sm text-orange-600 font-medium group/link hover:underline flex items-center"
                    >
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                    <Link
                      to="/contact"
                      className="text-xs bg-orange-100 text-orange-700 font-semibold px-3 py-1 rounded-full shadow hover:bg-orange-200 transition"
                    >
                      Enroll Now
                    </Link>
                  </div>
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
