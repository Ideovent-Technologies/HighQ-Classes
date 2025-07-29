import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import CountUp from "react-countup";

const testimonials = [
  {
    id: 1,
    name: "Ankita Sharma",
    role: "NEET Topper",
    comment:
      "HighQ's personalized coaching helped me stay focused and reach my dream medical college. The mock tests and doubt-clearing sessions were game changers.",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
  },
  {
    id: 2,
    name: "Rajat Verma",
    role: "JEE AIR 110",
    comment:
      "The faculty here truly cares about our success. From concept clarity to strategy planning, I always felt supported at every step.",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 3,
    name: "Sneha Roy",
    role: "WBJEE Ranker",
    comment:
      "What I loved the most was how HighQ balanced board prep and entrance training. The study materials were concise and well-structured.",
    image: "https://randomuser.me/api/portraits/women/62.jpg",
  },
];

const stats = [
  { label: "JEE Top Rankers", value: 250 },
  { label: "NEET Selections", value: 400 },
  { label: "WBJEE Qualifiers", value: 300 },
  { label: "Doubt Sessions", value: 10000 },
];

const Testimonials = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-24 px-4 overflow-hidden">
      {/* Subtle Top Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg
          viewBox="0 0 500 50"
          preserveAspectRatio="none"
          className="w-full h-20 fill-white opacity-60"
        >
          <path d="M0.00,49.98 C150.00,0.00 350.00,100.00 500.00,49.98 L500.00,50.00 L0.00,50.00 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Section Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-4 text-navy-700"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          💬 Hear from Our Toppers
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          Real journeys. Real ranks. Real impact.
        </motion.p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              className="relative bg-white p-6 rounded-3xl shadow-xl hover:shadow-orange-200 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Floating quote icon */}
              <Quote className="absolute top-4 right-4 text-orange-100 w-6 h-6 group-hover:text-orange-400 transition-colors" />

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                />
                <div className="text-left">
                  <h4 className="text-navy-700 font-semibold text-lg">
                    {t.name}
                  </h4>
                  <p className="text-sm text-orange-500 font-medium">
                    {t.role}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                “{t.comment}”
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Counter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-orange-100/10 rounded-2xl blur-md z-0" />
              <p className="text-3xl font-bold text-orange-600 z-10">
                <CountUp
                  end={stat.value}
                  duration={2}
                  separator=","
                  suffix="+"
                />
              </p>
              <p className="text-gray-600 mt-2 text-sm font-medium z-10">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Glow blob for background magic */}
      <div className="absolute -bottom-20 -left-20 w-[50vw] h-[50vw] bg-orange-300 opacity-10 rounded-full blur-3xl z-0" />
    </section>
  );
};

export default Testimonials;
