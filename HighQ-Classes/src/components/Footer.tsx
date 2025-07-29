import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="absolute -top-10 -left-10 opacity-10 blur-2xl w-96 h-96 rounded-full bg-teal-500 z-0" />
      <div className="absolute -bottom-10 -right-10 opacity-10 blur-2xl w-96 h-96 rounded-full bg-orange-500 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <span className="text-3xl font-bold font-poppins text-white">Bloom</span>
              <span className="text-3xl font-bold font-poppins text-teal-400">Scholar</span>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6">
              Empowering students to achieve academic excellence through personalized coaching and mentorship.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="hover:text-blue-500 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-red-500 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-blue-300 transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Login", to: "/login" },
                { label: "Register", to: "/register" }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Contact</h3>
            <ul className="space-y-5 text-gray-300 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-teal-400 mt-1" />
                <span>
                  123 Education Street,<br />
                  Academic District,<br />
                  City, State 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-teal-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-teal-400" />
                info@bloomscholar.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} BloomScholar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
