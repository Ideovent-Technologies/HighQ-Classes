import { ShieldCheck, Clock, Users, Lightbulb, BookOpenCheck, Medal } from "lucide-react";
import { motion, Variants } from "framer-motion";

const promises = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-orange-600" />,
    title: "Expert Faculty",
    description: "Learn from experienced teachers who specialize in JEE, NEET & WBJEE preparation.",
  },
  {
    icon: <Clock className="h-6 w-6 text-orange-600" />,
    title: "Structured Study Plan",
    description: "Stay on track with a plan tailored for each course and exam pattern.",
  },
  {
    icon: <Users className="h-6 w-6 text-orange-600" />,
    title: "Doubt Clearing & Mentorship",
    description: "1:1 support, regular doubt clearing, and mentorship to guide you forward.",
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-orange-600" />,
    title: "Practical Learning",
    description: "Concept-building through application, not rote memorization.",
  },
  {
    icon: <BookOpenCheck className="h-6 w-6 text-orange-600" />,
    title: "Regular Assessments",
    description: "Track your performance with frequent tests and improve step by step.",
  },
  {
    icon: <Medal className="h-6 w-6 text-orange-600" />,
    title: "Topper's Strategy Access",
    description: "Learn directly from previous toppers — their routines, mistakes, and advice.",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1], // Easing array instead of string
    },
  },
};

const FearAndPromiseBlock = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 px-6 py-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Fear Block */}
        <motion.div
          className="text-center lg:text-left space-y-6"
          initial="hidden"
          whileInView="show"
          variants={container}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold leading-tight text-navy-800"
            variants={item}
          >
            Do you fear <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">falling behind</span> in <br />
            competitive exams?
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 max-w-xl mx-auto lg:mx-0"
            variants={item}
          >
            You’re not alone. Thousands of students feel the pressure. But with the{" "}
            <span className="font-semibold text-navy-600">right guidance, structure, and support</span> — you can overcome any challenge and shine bright in JEE, NEET, or WBJEE.
          </motion.p>
          <motion.p
            className="text-md text-gray-600 max-w-xl mx-auto lg:mx-0"
            variants={item}
          >
            Whether you're starting fresh or aiming to improve, we’re here to push you forward — <span className="italic">one smart step at a time.</span>
          </motion.p>

          <motion.div variants={item}>
            <button className="mt-4 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-md hover:bg-orange-600 transition-all duration-300 hover:scale-105">
              Explore Programs
            </button>
          </motion.div>
        </motion.div>

        {/* Right - Promises */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {promises.map((itemData, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-orange-100 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 shadow-inner">
                  {itemData.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-center text-navy-800 group-hover:text-orange-600 mb-2">
                {itemData.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">{itemData.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FearAndPromiseBlock;
