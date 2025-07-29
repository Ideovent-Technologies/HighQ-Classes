import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedCourses from "../components/home/FeaturedCourses";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";
import FearAndPromiseBlock from "../components/home/FearAndPromiseBlock";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-navy-50 scroll-smooth">
      <HeroSection />
      <FeaturedCourses />
      <FearAndPromiseBlock/>
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;

