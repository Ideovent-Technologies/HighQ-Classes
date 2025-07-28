import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import CourseCard from "./CourseCard";

interface Course {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface CourseCarouselProps {
  courses: Course[];
}

const CourseCarousel = ({ courses }: CourseCarouselProps) => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
      loop={true}
      spaceBetween={24}
      breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
    >
      {courses.map((course) => (
        <SwiperSlide key={course.id}>
          <CourseCard {...course} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CourseCarousel;
