import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import {
    ChevronRight,
    BookOpen,
    Clock,
    // DollarSign,
    IndianRupee,
} from "lucide-react";
import { Link } from "react-router-dom";
import "swiper/css";

import courseService from "@/API/services/courseService";
import { Course } from "@/types/course.types";

// Default course images (you can update these paths to match your assets)
import Thumb1 from "@/assets/featured-course/1.svg";
import Thumb2 from "@/assets/featured-course/2.svg";
import Thumb3 from "@/assets/featured-course/3.svg";
import Thumb4 from "@/assets/featured-course/4.svg";

const defaultImages = [Thumb1, Thumb2, Thumb3, Thumb4];

const FeaturedCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await courseService.getAllCourses();

                if (response.success && response.courses) {
                    // Take only the first 8 courses for featured display
                    const featuredCourses = response.courses.slice(0, 8);
                    setCourses(featuredCourses);
                    setError(null);
                } else {
                    setError("No courses available");
                }
            } catch (err: any) {
                console.error("Error fetching courses:", err);
                setError("Unable to load courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Helper function to get course image
    const getCourseImage = (index: number) => {
        return defaultImages[index % defaultImages.length];
    };

    // Helper function to format course fee
    const formatFee = (fee: number) => {
        if (fee === 0) return "Free";
        if (fee >= 1000) return `₹${(fee / 1000).toFixed(1)}k`;
        return `₹${fee}`;
    };

    if (loading) {
        return (
            <section className="py-28 bg-gradient-to-b from-orange-50 to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-transparent bg-clip-text mb-4">
                            Our Featured Programs
                        </h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                            Loading our amazing courses...
                        </p>
                    </div>

                    {/* Loading skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-lg animate-pulse"
                            >
                                <div className="h-48 bg-gray-200" />
                                <div className="p-5">
                                    <div className="h-6 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-28 bg-gradient-to-b from-orange-50 to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-transparent bg-clip-text mb-4">
                            Our Featured Programs
                        </h2>
                        <p className="text-lg text-red-600 max-w-2xl mx-auto leading-relaxed">
                            {error}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-28 bg-gradient-to-b from-orange-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-transparent bg-clip-text mb-4 animate-gradient-x drop-shadow-xl">
                        Our Featured Programs
                    </h2>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Discover our comprehensive courses designed by expert
                        instructors to help you achieve your academic goals.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <div className="w-36 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Course Carousel */}
                {courses.length > 0 ? (
                    <Swiper
                        modules={[Autoplay]}
                        loop={courses.length > 3}
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
                        {courses.map((course, i) => (
                            <SwiperSlide key={course._id}>
                                <div className="group relative bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                                    {/* Image Thumbnail */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={getCourseImage(i)}
                                            alt={course.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 group-hover:opacity-90 transition" />
                                        <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                            Featured
                                        </span>
                                        <div className="absolute bottom-3 right-3 bg-white/90 text-orange-600 text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center">
                                            <IndianRupee className="w-3 h-3 mr-1" />
                                            {/* {formatFee(course.fee)} */}
                                            {course.fee}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col justify-between h-[280px]">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition line-clamp-2">
                                                {course.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
                                                {course.description ||
                                                    "Comprehensive course designed to help you excel in your studies."}
                                            </p>

                                            {/* Course Details */}
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                <div className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {course.duration}
                                                </div>
                                                <div className="flex items-center">
                                                    <BookOpen className="w-3 h-3 mr-1" />
                                                    {course.topics?.length || 0}{" "}
                                                    Topics
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-between items-center">
                                            <Link
                                                to={`/courses/${course._id}`}
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
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">
                            No courses available at the moment.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCourses;
