
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link-active' : 'nav-link';
  };

  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold font-poppins text-navy-500">Bloom</span>
              <span className="text-2xl font-bold font-poppins text-teal-500">Scholar</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-1">
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
            <div className="ml-4 flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-navy-500 text-white hover:bg-navy-600">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="outline-none">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-navy-500" />
              ) : (
                <Menu className="h-6 w-6 text-navy-500" />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`${isActive(item.path)} block`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }} 
                  className="nav-link block text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
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
