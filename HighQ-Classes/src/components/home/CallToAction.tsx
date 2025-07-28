import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="w-full py-16 bg-navy-600 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Elevate Your Learning?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          Join BloomScholar today and unlock a personalized academic journey tailored for your success.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg" variant="default">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy-600">
            <Link to="/contact">Talk to Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
