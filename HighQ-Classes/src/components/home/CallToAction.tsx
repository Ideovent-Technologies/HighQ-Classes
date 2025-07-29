import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="w-full py-20 bg-white text-navy-800 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Ready to Elevate Your Learning?
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Join <span className="text-orange-500 font-semibold">BloomScholar</span> today and unlock a personalized academic journey tailored for your success.
        </p>

        <div className="flex justify-center gap-5 flex-wrap">
          {/* Primary Button – Visible on white */}
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white px-8 py-4 text-base font-semibold rounded-full shadow-md"
          >
            <Link to="/register">Get Started</Link>
          </Button>

          {/* Outline Button – With border and text color adjusted */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white transition-all duration-300 px-8 py-4 text-base font-semibold rounded-full shadow-md"
          >
            <Link to="/contact">Talk to Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
