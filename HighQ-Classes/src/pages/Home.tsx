import React from "react";

// Section Imports (relative to src/pages)
import HeroSection from "../components/home/HeroSection";
import FeaturedCourses from "../components/home/FeaturedCourses";
import PromiseBlock from "../components/home/PromiseBlock";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";
// import Footer from "../components/ui/Footer";
// import Navbar from "../components/ui/Navbar";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-navy-50 scroll-smooth">
      {/* <Navbar /> */}
      <HeroSection />
      <FeaturedCourses />
      <PromiseBlock />
      <Testimonials />
      <CallToAction />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;

