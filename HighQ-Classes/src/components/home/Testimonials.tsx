const testimonials = [
  {
    id: 1,
    name: "Ankita Sharma",
    role: "NEET Topper",
    comment:
      "HighQ's personalized coaching helped me stay focused and reach my dream medical college. The mock tests and doubt-clearing sessions were game changers.",
    image:
      "https://randomuser.me/api/portraits/women/75.jpg",
  },
  {
    id: 2,
    name: "Rajat Verma",
    role: "JEE AIR 110",
    comment:
      "The faculty here truly cares about our success. From concept clarity to strategy planning, I always felt supported at every step.",
    image:
      "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 3,
    name: "Sneha Roy",
    role: "WBJEE Ranker",
    comment:
      "What I loved the most was how HighQ balanced board prep and entrance training. The study materials were concise and well-structured.",
    image:
      "https://randomuser.me/api/portraits/women/62.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-navy-50 min-h-screen flex flex-col justify-center py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-700">
          Hear from Our Toppers
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Real stories from students who achieved success through our programs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-navy-700 font-semibold">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                “{t.comment}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
