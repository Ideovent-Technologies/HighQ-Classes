
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Award, Users, Check, File, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const engineeringServices = [
    {
      id: 1,
      title: "JEE Mains & Advanced Coaching",
      description: "Comprehensive preparation for JEE with focus on conceptual clarity and problem-solving.",
      features: [
        "Regular mock tests and assessments",
        "Doubt clearing sessions",
        "Study material and practice questions",
        "Performance tracking and analysis"
      ],
      icon: <BookOpen className="h-10 w-10 text-navy-500" />
    },
    {
      id: 2,
      title: "State Engineering Entrance Preparation",
      description: "Specialized coaching for state-level engineering entrance examinations.",
      features: [
        "State-specific syllabus coverage",
        "Previous years' question analysis",
        "Strategic preparation plan",
        "Regular practice tests"
      ],
      icon: <File className="h-10 w-10 text-navy-500" />
    }
  ];

  const medicalServices = [
    {
      id: 1,
      title: "NEET Preparation",
      description: "Comprehensive course for medical entrance exams with focus on Biology, Chemistry, and Physics.",
      features: [
        "Topic-wise tests and assessments",
        "Specialized biology practical sessions",
        "Regular doubt clearing",
        "Comprehensive study material"
      ],
      icon: <BookOpen className="h-10 w-10 text-teal-500" />
    },
    {
      id: 2,
      title: "AIIMS & JIPMER Coaching",
      description: "Specialized preparation for premier medical institutions entrance exams.",
      features: [
        "Advanced problem-solving techniques",
        "Exam-specific strategy sessions",
        "Regular mock tests",
        "Personalized mentoring"
      ],
      icon: <File className="h-10 w-10 text-teal-500" />
    }
  ];

  const foundationServices = [
    {
      id: 1,
      title: "Class 8-10 Foundation Program",
      description: "Building strong fundamentals for future competitive exam preparation.",
      features: [
        "Focus on core concepts in science and mathematics",
        "Analytical thinking development",
        "Regular assessments and feedback",
        "Parent-teacher meetings"
      ],
      icon: <Award className="h-10 w-10 text-coral-500" />
    },
    {
      id: 2,
      title: "Olympiad Training",
      description: "Specialized coaching for various national and international Olympiads.",
      features: [
        "Advanced problem-solving techniques",
        "Previous years' question analysis",
        "Regular mock tests",
        "One-on-one mentoring sessions"
      ],
      icon: <Clock className="h-10 w-10 text-coral-500" />
    }
  ];

  const faqs = [
    {
      question: "How are the batches organized?",
      answer: "Our batches are organized based on academic goals, current knowledge level, and schedule preferences. We keep our batch sizes small (20-25 students) to ensure personalized attention for each student."
    },
    {
      question: "What is the fee structure?",
      answer: "Our fee structure varies depending on the program, duration, and level. We offer flexible payment options including installment plans. Please contact our admissions office for detailed information about the specific program you're interested in."
    },
    {
      question: "Do you provide study materials?",
      answer: "Yes, we provide comprehensive study materials developed by our expert faculty, including textbooks, practice question banks, and online resources. These are included in the program fee."
    },
    {
      question: "How do you handle doubts and queries?",
      answer: "We have regular doubt clearing sessions after classes. Students can also schedule one-on-one sessions with teachers for more complex doubts. We also have an online portal where students can post their queries and get responses within 24 hours."
    },
    {
      question: "Do you conduct regular tests?",
      answer: "Yes, we conduct weekly topic tests, monthly comprehensive tests, and full-length mock exams to assess student progress and identify areas that need more attention."
    },
    {
      question: "How do you communicate student progress to parents?",
      answer: "We have a robust progress tracking system. Parents receive monthly progress reports and we conduct quarterly parent-teacher meetings. Parents can also schedule individual meetings with teachers or the academic coordinator as needed."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Coaching Services</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Comprehensive coaching programs designed to help students achieve their academic goals and excel in competitive examinations.
            </p>
            <Link to="/contact" className="btn-accent">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Our Programs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of specialized coaching programs tailored to different academic needs and goals.
          </p>
        </div>

        <Tabs defaultValue="engineering" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engineering">Engineering</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="foundation">Foundation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="engineering" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {engineeringServices.map((service) => (
                <Card key={service.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-navy-500 mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild>
                      <Link to="/contact">Enquire Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="medical" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medicalServices.map((service) => (
                <Card key={service.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild>
                      <Link to="/contact">Enquire Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="foundation" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foundationServices.map((service) => (
                <Card key={service.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-coral-500 mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild>
                      <Link to="/contact">Enquire Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Additional Features Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Beyond regular coaching, we offer various supplementary services to enhance the learning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-navy-50 p-3 rounded-full inline-block mb-4">
                <Clock className="h-8 w-8 text-navy-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Doubt Clearing Sessions</h3>
              <p className="text-gray-600">
                Regular sessions dedicated to resolving student queries and reinforcing difficult concepts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-teal-50 p-3 rounded-full inline-block mb-4">
                <File className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Test Series</h3>
              <p className="text-gray-600">
                Comprehensive test series simulating actual exam conditions to help students assess their preparation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-coral-50 p-3 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Parent-Teacher Meetings</h3>
              <p className="text-gray-600">
                Regular interactions between parents and teachers to discuss student progress and areas of improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our coaching programs and services.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <button 
                className="flex justify-between items-center w-full text-left font-semibold text-lg"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="mt-2 text-gray-600 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy-600 to-navy-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our programs and how we can help you achieve your academic goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-accent">
              Register Now
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-navy-500">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
