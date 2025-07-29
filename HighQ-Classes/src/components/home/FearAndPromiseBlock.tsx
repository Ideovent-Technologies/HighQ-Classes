import { ShieldCheck, Clock, Users, Lightbulb, BookOpenCheck, Medal} from "lucide-react";

const promises = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-orange-500" />,
    title: "Expert Faculty",
    description: "Learn from experienced teachers who specialize in JEE, NEET & WBJEE preparation.",
  },
  {
    icon: <Clock className="h-8 w-8 text-orange-500" />,
    title: "Structured Study Plan",
    description: "Stay on track with a plan tailored for each course and exam pattern.",
  },
  {
    icon: <Users className="h-8 w-8 text-orange-500" />,
    title: "Doubt Clearing & Mentorship",
    description: "1:1 support, regular doubt clearing, and mentorship to guide you forward.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-orange-500" />,
    title: "Practical Learning",
    description: "Concept-building through application, not rote memorization.",
  },
  {
    icon: <BookOpenCheck className="h-8 w-8 text-orange-500" />,
    title: "Regular Assessments",
    description: "Track your performance with frequent tests and improve step by step.",
  },
   {
    icon: <Medal className="h-8 w-8 text-orange-500" />,
    title: "Topper's Strategy Access",
    description: "Learn directly from previous toppers — their routines, mistakes, and advice.",
  },
];

const FearAndPromiseBlock = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-navy-50 px-6 py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Fear Block */}
        <div className="text-center lg:text-left space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-navy-700 leading-tight">
            Do you fear falling behind in <span className="text-orange-500">competitive exams?</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mx-auto lg:mx-0">
            You’re not alone. Thousands of students feel the pressure. But with the right guidance,
            structure, and support — you can overcome any challenge and shine bright in JEE, NEET, or WBJEE.
          </p>
          <p className="text-md text-gray-600 max-w-xl mx-auto lg:mx-0">
            Whether you're starting fresh or aiming to improve, we’re here to push you forward — one smart step at a time.
          </p>
          
        </div>

        {/* Right - Promises */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {promises.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold text-navy-700 mb-2 text-center">{item.title}</h3>
              <p className="text-sm text-gray-600 text-center">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FearAndPromiseBlock;
