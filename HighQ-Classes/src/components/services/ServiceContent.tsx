import React from "react";
import { motion } from "framer-motion";
import { easeOut } from "framer-motion";
import { serviceDescriptions } from "../data/servicesData";
import { CheckCircle, Users, Clock, BookOpenText } from "lucide-react"; // Icon set

const sectionVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut, 
    },
  },
};


const ServiceContent = ({ activeTab }) => {
  const service = serviceDescriptions[activeTab];

  if (!service)
    return (
      <p className="text-center text-red-500 font-semibold mt-10">
        Service details not found.
      </p>
    );

  return (
    <motion.div
      className="relative z-10 max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl px-8 py-12 sm:px-14 sm:py-16 mt-6"
      initial="initial"
      animate="animate"
      variants={sectionVariants}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-50 via-white to-pink-50 rounded-3xl" />

      {/* Headings */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-3 tracking-tight">
          {service.title}
        </h2>
        <h3 className="text-lg md:text-xl text-gray-600 font-medium">
          {service.subtitle}
        </h3>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-10 text-center max-w-3xl mx-auto">
        {service.description}
      </p>

      {/* Benefits */}
      {service.benefits?.length > 0 && (
        <div className="mb-10">
          <h4 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Benefits You'll Get
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow p-4 border border-indigo-100 hover:shadow-lg transition-all duration-300"
              >
                ✅ {benefit}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Grid with Icons */}
      <div className="grid sm:grid-cols-2 gap-6 text-base mb-10">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-indigo-600 mt-1" />
          <div>
            <p className="text-gray-900 font-semibold">Target Audience</p>
            <p className="text-gray-600">
              {service.targetAudience || "Students interested in this field."}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <BookOpenText className="w-5 h-5 text-indigo-600 mt-1" />
          <div>
            <p className="text-gray-900 font-semibold">Mode</p>
            <p className="text-gray-600">{service.mode || "Online/Offline"}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-600 mt-1" />
          <div>
            <p className="text-gray-900 font-semibold">Duration</p>
            <p className="text-gray-600">
              {service.duration || "Flexible duration"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-indigo-600 mt-1" />
          <div>
            <p className="text-gray-900 font-semibold">Includes</p>
            <p className="text-gray-600">
              {service.includes ||
                "Course materials, mentorship, and assessments"}
            </p>
          </div>
        </div>
      </div>

      {/* Optional Image */}
      {service.image && (
        <motion.div
          className="mb-10 overflow-hidden rounded-2xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-80 object-cover"
          />
        </motion.div>
      )}

      {/* CTA */}
      {service.enquiryLink && (
        <div className="text-center mt-6">
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={service.enquiryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition-all duration-300"
          >
            ✨ Enquire Now
          </motion.a>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceContent;
