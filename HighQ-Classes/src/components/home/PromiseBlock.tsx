import { ShieldCheck, Clock, Users, Lightbulb } from "lucide-react";

const promises = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-navy-500" />,
    title: "Expert Faculty",
    description: "Learn from experienced teachers who specialize in JEE, NEET & WBJEE preparation.",
  },
  {
    icon: <Clock className="h-8 w-8 text-navy-500" />,
    title: "Structured Study Plan",
    description: "Stay on track with a plan tailored for each course and exam pattern.",
  },
  {
    icon: <Users className="h-8 w-8 text-navy-500" />,
    title: "Doubt Clearing & Mentorship",
    description: "1:1 support, regular doubt clearing, and mentorship to guide you forward.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-navy-500" />,
    title: "Practical Learning",
    description: "Concept-building through application, not rote memorization.",
  },
];

const PromiseBlock = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-white to-navy-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mb-12">
          Why Students Trust HighQ
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {promises.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-navy-700 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromiseBlock;
