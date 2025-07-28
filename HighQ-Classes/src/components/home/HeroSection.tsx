import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import banner from "@/assets/hero-section/banner.svg";

const HeroSection = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${banner})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start">
        <motion.div
          className="text-left max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Unlock Your Academic Potential
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            Join BloomScholar Coaching Center for personalized learning,
            expert guidance, and a pathway to academic excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="default" size="lg">
              <Link to="/services">Explore Courses</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
