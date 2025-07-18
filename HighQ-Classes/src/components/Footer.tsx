
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold font-poppins text-white">Bloom</span>
              <span className="text-2xl font-bold font-poppins text-teal-400">Scholar</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Empowering students to achieve academic excellence through personalized coaching and mentorship.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.666.254 1.23.642 1.694 1.107.46.46.846 1.025 1.097 1.69.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.904 4.904 0 01-1.096 1.69c-.46.46-1.025.846-1.69 1.097-.637.247-1.364.416-2.428.465-1.012.048-1.368.06-4.042.06-2.675 0-3.031-.012-4.04-.06-1.07-.049-1.79-.218-2.428-.465a4.824 4.824 0 01-1.69-1.097 4.981 4.981 0 01-1.097-1.69c-.247-.636-.416-1.363-.465-2.428-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.254-.666.642-1.23 1.097-1.69C6.584 3.307 7.15 2.921 7.815 2.67c.636-.247 1.363-.416 2.427-.465C11.32 2.013 11.674 2 12.315 2zm0 1.802c-2.338 0-2.676.01-3.709.057-.957.044-1.49.202-1.84.336-.46.178-.79.39-1.138.739-.349.35-.56.679-.739 1.138-.134.35-.292.883-.336 1.84-.047 1.033-.057 1.37-.057 3.709s.01 2.676.057 3.709c.044.957.202 1.49.336 1.84.178.46.39.79.739 1.138.35.349.679.56 1.138.739.35.134.883.292 1.84.336 1.033.047 1.37.057 3.709.057s2.676-.01 3.709-.057c.957-.044 1.49-.202 1.84-.336.46-.178.79-.39 1.138-.739.349-.35.56-.679.739-1.138.134-.35.292-.883.336-1.84.047-1.033.057-1.37.057-3.709s-.01-2.676-.057-3.709c-.044-.957-.202-1.49-.336-1.84a3.063 3.063 0 00-.739-1.138 3.063 3.063 0 00-1.138-.739c-.35-.134-.883-.292-1.84-.336-1.033-.047-1.37-.057-3.709-.057z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white">Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-6 w-6 text-teal-400 mr-2" />
                <span className="text-gray-300">
                  123 Education Street,<br />
                  Academic District,<br />
                  City, State 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-6 w-6 text-teal-400 mr-2" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-6 w-6 text-teal-400 mr-2" />
                <span className="text-gray-300">info@bloomscholar.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} BloomScholar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
