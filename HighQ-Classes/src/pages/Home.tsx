import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedCourses from "../components/home/FeaturedCourses";
import PromiseBlock from "../components/home/PromiseBlock";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-navy-50 scroll-smooth">
      <HeroSection />
      <FeaturedCourses />
      <PromiseBlock />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;

