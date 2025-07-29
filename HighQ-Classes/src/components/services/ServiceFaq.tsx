import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Can I switch between online and offline?",
    answer: "Yes, we allow hybrid flexibility based on performance and availability.",
  },
  {
    question: "How are doubts solved?",
    answer: "Via live Zoom sessions, discussion boards, and WhatsApp chat with faculty.",
  },
];

const ServiceFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0">
      <h3 className="text-2xl font-bold text-center text-slate-800 mb-10">
        Frequently Asked Questions
      </h3>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-300 rounded-xl bg-white shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-slate-700 hover:text-indigo-600 focus:outline-none"
              >
                <span>{faq.question}</span>
                <span className="text-xl font-bold">
                  {isOpen ? "−" : "+"}
                </span>
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
                    <p className="text-sm text-gray-600">{faq.answer}</p>
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
