import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedCourses from "../components/home/FeaturedCourses";
import FearAndPromiseBlock from "../components/home/FearAndPromiseBlock";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";

const Home = () => {
    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-white to-navy-50 scroll-smooth">
            {/* 1. Hero: Grab attention */}
            <section id="hero">
                <HeroSection />
            </section>

            {/* 2. Featured Courses: Show value immediately */}
            <section id="courses">
                <FeaturedCourses />
            </section>

            {/* 3. Fear & Promise: Address pain-points and solutions */}
            <section id="why-us">
                <FearAndPromiseBlock />
            </section>

            {/* 4. Testimonials: Add social proof */}
            <section id="testimonials">
                <Testimonials />
            </section>

            {/* 5. CTA: Final push to convert */}
            <section id="get-started">
                <CallToAction />
            </section>
        </main>
    );
};

export default Home;
