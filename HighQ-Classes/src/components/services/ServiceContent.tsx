import React from "react";
import { motion, Variants, easeOut } from "framer-motion";
import { CheckCircle, Users, Clock, BookOpenText } from "lucide-react";
import { serviceDescriptions } from "../data/servicesData";

interface ServiceContentProps {
    activeTab: string;
}

const sectionVariants: Variants = {
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

const ServiceContent: React.FC<ServiceContentProps> = ({ activeTab }) => {
    const service = serviceDescriptions[activeTab];

    if (!service) {
        return (
            <p className="text-center text-red-500 font-semibold mt-10">
                Service details not found.
            </p>
        );
    }

    return (
        <motion.div
            id="service-details"
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
                                {benefit}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Details Grid with Icons */}
            <div className="grid sm:grid-cols-2 gap-6 text-base mb-10">
                <DetailItem
                    icon={<Users className="w-5 h-5 text-indigo-600 mt-1" />}
                    title="Target Audience"
                    content={
                        service.targetAudience ||
                        "Students interested in this field."
                    }
                />
                <DetailItem
                    icon={
                        <BookOpenText className="w-5 h-5 text-indigo-600 mt-1" />
                    }
                    title="Mode"
                    content={service.mode || "Online/Offline"}
                />
                <DetailItem
                    icon={<Clock className="w-5 h-5 text-indigo-600 mt-1" />}
                    title="Duration"
                    content={service.duration || "Flexible duration"}
                />
                <DetailItem
                    icon={
                        <CheckCircle className="w-5 h-5 text-indigo-600 mt-1" />
                    }
                    title="Includes"
                    content={
                        service.includes ||
                        "Course materials, mentorship, and assessments"
                    }
                />
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

// Reusable Detail Item
const DetailItem = ({
    icon,
    title,
    content,
}: {
    icon: React.ReactNode;
    title: string;
    content: string;
}) => (
    <div className="flex items-start gap-3">
        {icon}
        <div>
            <p className="text-gray-900 font-semibold">{title}</p>
            <p className="text-gray-600">{content}</p>
        </div>
    </div>
);
