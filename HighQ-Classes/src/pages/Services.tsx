import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ServiceTabs from "../components/services/ServiceTabs";
import ServiceContent from "../components/services/ServiceContent";
import ServiceFaq from "../components/services/ServiceFaq";
import { motion } from "framer-motion";

const Services = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "foundation";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync tab with query param if user clicks "Learn More" from elsewhere
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-white text-gray-800 pt-24">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16 px-4 bg-gradient-to-br from-indigo-900 to-slate-800 text-white shadow-xl rounded-b-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore Our Services
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed">
          Personalized academic support to guide every student from foundations to excellence.
        </p>
      </motion.div>

      {/* SERVICE TABS */}
      <section className="py-10 px-4 sm:px-8 lg:px-20">
        <ServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>

      {/* SERVICE CONTENT */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="px-4 sm:px-8 lg:px-20"
      >
        <ServiceContent activeTab={activeTab} />
      </motion.section>

      {/* FAQ */}
      <section className="mt-20 px-4 sm:px-8 lg:px-20">
        <ServiceFaq />
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-24 mb-16 px-6"
      >
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-700 to-indigo-500 text-white py-12 px-8 rounded-3xl shadow-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Still Confused? We Can Help!
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Speak with our academic advisors and let us recommend the perfect track tailored to your goals and strengths.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            Enquire Now
          </a>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
