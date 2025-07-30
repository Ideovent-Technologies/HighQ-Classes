import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Can I switch between online and offline classes?",
    answer: "Yes, we offer hybrid flexibility. Based on your performance and seat availability, you can request a shift.",
  },
  {
    question: "How are doubts solved?",
    answer: "We solve doubts via live Zoom sessions, teacher-led discussion boards, and active WhatsApp support groups.",
  },
  {
    question: "Are recorded lectures available for all classes?",
    answer: "Yes, every class is recorded and made available for 3–5 days after the session so students can revise or catch up.",
  },
  {
    question: "Is there any scholarship or discount available?",
    answer: "We offer scholarships based on entrance tests and past academic performance. Reach out to our team for eligibility.",
  },
  {
    question: "How can parents track student progress?",
    answer: "Through our HighQ portal and monthly performance reports. We also conduct regular PTMs (Parent Teacher Meetings).",
  },
  {
    question: "What if I miss a test or assignment?",
    answer: "We provide makeup tests and extra assignment slots in genuine cases. Contact your coordinator for rescheduling.",
  },
];

const ServiceFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 pb-20">
      <h3 className="text-3xl font-bold text-center text-slate-800 mb-10">
        Frequently Asked Questions
      </h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl bg-white shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-slate-800 hover:text-indigo-600 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <span className="text-xl font-bold">{isOpen ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4"
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceFaq;
