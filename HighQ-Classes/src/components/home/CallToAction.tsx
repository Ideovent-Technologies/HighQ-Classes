import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="relative w-full py-24 bg-white text-navy-800 overflow-hidden">
      {/* Optional background shapes */}
      <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-orange-100 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] bg-purple-100 rounded-full blur-3xl opacity-30 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-6 text-center relative z-10"
      >
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight relative inline-block">
          <span className="relative z-10">Ready to Elevate Your Learning?</span>
          <span className="absolute inset-0 bg-gradient-to-r from-orange-200 to-pink-200 opacity-20 blur-xl rounded-lg -z-10"></span>
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Join <span className="text-orange-500 font-semibold">BloomScholar</span> today and unlock a personalized academic journey tailored for your success.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-5 flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white px-8 py-4 text-base font-semibold rounded-full shadow-lg hover:shadow-xl hover:brightness-110 flex items-center gap-2"
          >
            <Link to="/register">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white transition-all duration-300 px-8 py-4 text-base font-semibold rounded-full shadow-md"
          >
            <Link to="/contact">Talk to Us</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
