
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Award, Users, ChevronRight, Star } from 'lucide-react';

const Home = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Ananya Sharma',
      role: 'Engineering Student',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      text: 'BloomScholar coaching center helped me crack my entrance exams with flying colors. The personalized attention and focus on fundamentals made all the difference.',
      stars: 5,
    },
    {
      id: 2,
      name: 'Rahul Patel',
      role: 'Medical Student',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      text: 'The doubt clearing sessions were invaluable for my preparation. The teachers are experts in their fields and always willing to go the extra mile.',
      stars: 5,
    },
    {
      id: 3,
      name: 'Priya Singh',
      role: 'Parent',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      text: "I've seen remarkable improvement in my daughter's academic performance since she joined BloomScholar. The regular progress reports keep me updated on her development.",
      stars: 4,
    },
  ];

  const courses = [
    {
      id: 1,
      title: 'Engineering Entrance Preparation',
      description: 'Comprehensive course covering Physics, Chemistry, and Mathematics for engineering aspirants.',
      icon: <BookOpen className="h-10 w-10 text-navy-500" />,
    },
    {
      id: 2,
      title: 'Medical Entrance Coaching',
      description: 'Expert guidance for NEET and other medical entrance examinations with focus on Biology, Chemistry, and Physics.',
      icon: <Clock className="h-10 w-10 text-navy-500" />,
    },
    {
      id: 3,
      title: 'Foundation Courses',
      description: 'Early preparation programs for students in grades 8-10, building strong fundamentals for competitive exams.',
      icon: <Award className="h-10 w-10 text-navy-500" />,
    },
    {
      id: 4,
      title: 'Crash Courses',
      description: 'Intensive short-term programs for last-minute preparation and revision before examinations.',
      icon: <Users className="h-10 w-10 text-navy-500" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Unlock Your Academic Potential
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Join BloomScholar Coaching Center for personalized learning, expert guidance, and a pathway to academic excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services" className="btn-secondary">
                  Explore Courses
                </Link>
                <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-navy-500">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
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
        </div>
      </section>

      {/* Courses Section */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Featured Programs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our specialized coaching programs designed to help students excel in various competitive examinations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="card-hover">
              <CardContent className="p-6">
                <div className="mb-4">{course.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <Link 
                  to="/services" 
                  className="inline-flex items-center text-navy-500 font-medium hover:text-navy-700"
                >
                  Learn More <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BloomScholar?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our unique approach to education sets us apart and helps students achieve their academic goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-navy-50 p-3 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-navy-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600">
                Learn from experienced educators who are subject matter experts with proven track records.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-teal-50 p-3 rounded-full inline-block mb-4">
                <BookOpen className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                Customized study plans and attention to individual needs to ensure optimal progress.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-coral-50 p-3 rounded-full inline-block mb-4">
                <Award className="h-8 w-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">
                Consistent success with students securing top ranks in various competitive examinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our students and parents about their experience with BloomScholar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < testimonial.stars 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy-600 to-navy-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Take the first step towards academic excellence by joining BloomScholar Coaching Center today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-accent">
              Register Now
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-navy-500">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
