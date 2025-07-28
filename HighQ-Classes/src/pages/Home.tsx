import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Award,
  Users,
  ChevronRight,
  Star,
} from "lucide-react";

const Home = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ananya Sharma",
      role: "Engineering Student",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "BloomScholar coaching center helped me crack my entrance exams with flying colors. The personalized attention and focus on fundamentals made all the difference.",
      stars: 5,
    },
    {
      id: 2,
      name: "Rahul Patel",
      role: "Medical Student",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      text: "The doubt clearing sessions were invaluable for my preparation. The teachers are experts in their fields and always willing to go the extra mile.",
      stars: 5,
    },
    {
      id: 3,
      name: "Priya Singh",
      role: "Parent",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      text: "I've seen remarkable improvement in my daughter's academic performance since she joined BloomScholar. The regular progress reports keep me updated on her development.",
      stars: 4,
    },
  ];

  const courses = [
    {
      id: 1,
      title: "Engineering Entrance Preparation",
      description:
        "Comprehensive course covering Physics, Chemistry, and Mathematics for engineering aspirants.",
      icon: <BookOpen className="h-10 w-10 text-navy-500" />,
    },
    {
      id: 2,
      title: "Medical Entrance Coaching",
      description:
        "Expert guidance for NEET and other medical entrance examinations with focus on Biology, Chemistry, and Physics.",
      icon: <Clock className="h-10 w-10 text-navy-500" />,
    },
    {
      id: 3,
      title: "Foundation Courses",
      description:
        "Early preparation programs for students in grades 8-10, building strong fundamentals for competitive exams.",
      icon: <Award className="h-10 w-10 text-navy-500" />,
    },
    {
      id: 4,
      title: "Crash Courses",
      description:
        "Intensive short-term programs for last-minute preparation and revision before examinations.",
      icon: <Users className="h-10 w-10 text-navy-500" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-navy-50">
      {/* Hero Section */}
      <section className="w-full h-screen overflow-hidden relative group">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center">
          {/* Left Side Content */}
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Unlock Your Academic Potential
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Join BloomScholar Coaching Center for personalized learning,
              expert guidance, and a pathway to academic excellence.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button asChild variant="default" size="lg">
                <Link to="/services">Explore Courses</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="md:w-1/2 md:pl-8">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                alt="Students studying"
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-coral-500 text-white py-4 px-6 rounded-lg shadow-lg hidden md:block">
                <p className="text-2xl font-bold">95%</p>
                <p className="text-sm">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-700">
              Our Featured Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our specialized coaching programs designed to help
              students excel in competitive exams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white min-h-[360px] flex flex-col justify-between"
              >
                <div className="flex items-center justify-center h-48 bg-navy-50">
                  <div className="bg-white p-4 rounded-full shadow-sm border border-gray-200">
                    {course.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-navy-700">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {course.description}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-navy-500 font-medium hover:underline"
                  >
                    Learn More
                    <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our students and parents about their experience with
              BloomScholar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="relative bg-white border border-gray-100 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  {/* Quotation Icon */}
                  <svg
                    className="w-10 h-10 text-coral-400 mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.17 6C4.4 8.11 3 10.3 3 13v5a1 1 0 001 1h5a1 1 0 001-1v-5a1 1 0 00-1-1H5.56c.53-1.42 1.87-2.69 3.7-3.95a1 1 0 10-1.09-1.67zM18.17 6c-2.77 2.11-4.17 4.3-4.17 7v5a1 1 0 001 1h5a1 1 0 001-1v-5a1 1 0 00-1-1h-3.44c.53-1.42 1.87-2.69 3.7-3.95a1 1 0 10-1.09-1.67z" />
                  </svg>

                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-coral-400 shadow-sm mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-navy-700">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.stars
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-coral-400 rounded-b-3xl transition-all group-hover:h-2" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Take the first step toward academic excellence with{" "}
            <span className="font-semibold text-coral-500">BloomScholar</span>{" "}
            Coaching Center.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="default" size="lg">
              <Link to="/register">Register Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
