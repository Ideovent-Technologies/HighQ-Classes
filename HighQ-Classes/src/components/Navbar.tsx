import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { state, logout } = useAuth();
  const { user, isAuthenticated } = state;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) =>
    location.pathname === path
      ? "font-semibold text-teal-400"
      : scrolled
      ? "text-gray-700 hover:text-navy-600"
      : "text-white hover:text-teal-300";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { title: "Services", path: "/services" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow border-b border-gray-200"
          : "bg-transparent text-white"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/1.png"
              alt="HighQ Logo"
              className="h-24 object-contain -my-2" // 🔹 96px tall & shifts up/down a bit
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={isActive(item.path)}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="ml-6 flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className={`border ${
                      scrolled
                        ? "border-gray-300 text-gray-700"
                        : "border-white text-black hover:bg-white hover:text-navy-600"
                    }`}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      size="sm"
                      className={`transition-colors duration-300 ${
                        scrolled
                          ? "bg-white text-navy-700 border border-gray-300 hover:bg-gray-100"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      }`}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="sm"
                      className={`${
                        scrolled
                          ? "bg-navy-500 text-white hover:bg-navy-600"
                          : "bg-white text-navy-700 hover:bg-gray-100"
                      }`}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu icon */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="outline-none">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 animate-fade-in shadow-sm border-t">
          <div className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-800 hover:text-navy-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
