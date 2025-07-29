import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="relative w-full py-28 bg-gradient-to-b from-white via-orange-50 to-purple-50 text-navy-800 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-orange-200 rounded-full blur-[120px] opacity-30 z-0" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] bg-purple-200 rounded-full blur-[100px] opacity-25 z-0" />
      <div className="absolute inset-0 bg-grid-small-white [mask-image:linear-gradient(to_bottom,white,transparent_90%)] opacity-20 z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 text-center relative z-10"
      >
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Ready to Elevate Your Learning?
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto font-medium">
          Join <span className="text-orange-500 font-bold">HighQ Classes</span> and unlock a tailored academic experience
          crafted to empower your future.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white px-8 py-4 text-base font-semibold rounded-full shadow-xl hover:shadow-orange-300 flex items-center gap-2"
          >
            <Link to="/register">
              Get Started{" "}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
