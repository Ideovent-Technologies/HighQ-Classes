import { motion } from "framer-motion";

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
  { label: "JEE Top Rankers", value: "250+" },
  { label: "NEET Selections", value: "400+" },
  { label: "WBJEE Qualifiers", value: "300+" },
  { label: "Doubt Sessions", value: "10,000+" },
];

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-navy-800">
          Hear from Our Toppers
        </h2>
        <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
          Real stories from students who achieved success through our programs.
        </p>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-orange-500"
                />
                <div className="text-left">
                  <h4 className="text-navy-700 font-semibold">{t.name}</h4>
                  <p className="text-sm text-orange-500 font-medium">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                “{t.comment}”
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-bold text-orange-600">{stat.value}</p>
              <p className="text-gray-600 mt-2 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
