import React from "react";
import { serviceTabs } from "../data/servicesData";
import { motion } from "framer-motion";

const tabVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08 },
  }),
};

const ServiceTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center flex-wrap gap-4">
        {serviceTabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              custom={index}
              initial="initial"
              animate="animate"
              variants={tabVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isActive
                  ? "bg-indigo-700 text-white border border-indigo-700 ring-indigo-700"
                  : "bg-white text-gray-800 border border-gray-300 hover:border-indigo-500 hover:text-indigo-600"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTabs;
