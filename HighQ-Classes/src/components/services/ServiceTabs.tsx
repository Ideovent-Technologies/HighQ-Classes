import React from "react";
import { serviceTabs } from "../data/servicesData";
import { motion, Variants } from "framer-motion";

interface ServiceTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const tabVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.07,
      type: "spring",
      stiffness: 120,
    },
  }),
};

const ServiceTabs: React.FC<ServiceTabsProps> = ({ activeTab, setActiveTab }) => {
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const section = document.getElementById("service-details");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
        {serviceTabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              custom={index}
              initial="initial"
              animate="animate"
              variants={tabVariants}
              whileHover={{ scale: 1.07, boxShadow: "0 0 10px rgba(99, 102, 241, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabClick(tab.id)}
              aria-pressed={isActive}
              className={`group p-5 rounded-2xl font-semibold text-center transition-all duration-300 shadow-md border-2
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-700"
                    : "bg-white text-gray-800 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
            >
              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                {tab.icon}
              </div>
              <div className="text-sm sm:text-base">{tab.label}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTabs;
