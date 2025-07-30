import React from "react";
import { motion } from "framer-motion";
import CallToAction from "../components/home/CallToAction";
import Testimonials from "../components/home/Testimonials";
import { CheckCircle } from "lucide-react";

const stats = [
  { value: "10K+", label: "Students Taught" },
  { value: "98%", label: "Doubt Resolution Rate" },
  { value: "25+", label: "Expert Faculty" },
  { value: "4.9★", label: "Average Student Rating" },
];

const highlights = [
  "Live interactive sessions & recordings available",
  "Personalized doubt-solving on WhatsApp",
  "Carefully curated study materials & mock tests",
  "Dedicated mentor support for every student",
  "Parent-teacher performance review system",
  "Hybrid classes — learn from anywhere",
];

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-700 via-[#1A2540] to-black text-white py-24 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 relative"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-orange-500 drop-shadow-lg">
            Empowering Minds, <br /> Shaping Futures
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200">
            At <span className="text-orange-400 font-medium">HighQ Classes</span>,
            we ignite curiosity and build leaders through a perfect blend of mentorship,
            innovation, and dedication.
          </p>
        </motion.div>

        {/* Decorative Gradient Circles */}
        <div className="absolute top-0 left-0 w-60 h-60 bg-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-2xl translate-x-1/3 translate-y-1/3 z-0" />
      </section>

      {/* Mission + Vision */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-orange-500"
          >
            <h2 className="text-3xl font-bold mb-4 text-navy-700">
              🎯 Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              To provide{" "}
              <span className="text-orange-500 font-medium">
                accessible, adaptive, and inspiring
              </span>{" "}
              education tailored to every student’s journey. We’re committed to
              transforming classrooms into thriving learning experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-xl border-r-8 border-orange-500"
          >
            <h2 className="text-3xl font-bold mb-4 text-navy-700">
              🌟 Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              To become India’s most trusted learning ecosystem by blending{" "}
              <span className="text-orange-500 font-medium">
                human connection and cutting-edge innovation
              </span>
              , making every learner future-ready.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
     <section className="relative bg-gradient-to-b from-white to-slate-50 py-24 px-6 overflow-hidden">
  <div className="text-center mb-16 relative z-10">
    <h3 className="text-4xl md:text-5xl font-extrabold text-navy-700 tracking-tight">
      🌟 Our Impact
    </h3>
    <p className="text-gray-600 mt-4 max-w-xl mx-auto text-lg">
      Numbers that reflect our dedication to shaping futures and delivering excellence.
    </p>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto relative z-10">
    {stats.map((item, i) => (
      <motion.div
        key={i}
        className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-100 hover:shadow-2xl transition duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.2 }}
      >
        <div className="text-5xl font-bold text-orange-500">{item.value}</div>
        <p className="mt-2 text-gray-600 font-medium">{item.label}</p>
      </motion.div>
    ))}
  </div>

  {/* Decorative Background Elements */}
  <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
</section>

      {/* Why Choose Us */}
     <section className="relative bg-gradient-to-br from-gray-100 via-white to-gray-50 py-20 px-6 overflow-hidden">
  <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
    <h3 className="text-4xl md:text-5xl font-extrabold text-navy-700 mb-4">
      💡 Why Choose <span className="text-orange-500">HighQ Classes?</span>
    </h3>
    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
      Because your dreams deserve more than just lectures — they deserve mentorship, innovation, and personal care.
    </p>
  </div>

  <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto relative z-10">
    {highlights.map((point, i) => (
      <motion.div
        key={i}
        className="flex items-start space-x-4 bg-white bg-opacity-90 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500 backdrop-blur"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
      >
        <CheckCircle className="text-green-500 mt-1 w-6 h-6 shrink-0" />
        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
          {point}
        </p>
      </motion.div>
    ))}
  </div>

  {/* Subtle glowing background pattern */}
  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[60vw] h-[60vw] bg-orange-100 opacity-20 rounded-full blur-3xl z-0" />
</section>


      {/* Testimonials (reused from home) */}
      <section className="bg-white">
        <Testimonials />
      </section>

      {/* Call to Action (reused from home) */}
      <CallToAction />
    </div>
  );
};

export default About;
