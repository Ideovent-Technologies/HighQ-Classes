import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import banner from "@/assets/hero-section/banner.svg";
import { Typewriter } from "react-simple-typewriter";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const HeroSection = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${banner})` }}
    >
      {/* Background zoom effect */}
      <motion.div
        className="absolute inset-0 bg-black/40 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start">
        <motion.div
          className="text-left max-w-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Gradient heading with 135deg theme */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-[linear-gradient(135deg,#ffffff,#3533cd)] bg-clip-text text-transparent drop-shadow-lg mb-4"
          >
            Unlock Your Academic Potential
          </motion.h1>

          {/* Typewriter subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 mb-6"
          >
            <Typewriter
              words={[
                "Join HighQ Coaching Center",
                "Get Expert Guidance from Top Mentors",
                "Achieve Excellence with Personalized Support",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={2000}
            />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="default" size="lg" className="shadow-lg">
                <Link to="/services">Explore Courses</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#3533cd] text-[#3533cd] hover:bg-[#3533cd] hover:text-white transition-colors duration-300"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
