
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  BookOpen,
  Users,
  FileText,
  Bell,
  Settings,
  LogOut,
  User,
  Upload,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-navy-100 text-navy-600' : 'text-gray-600 hover:bg-navy-50';
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Home className="h-5 w-5 mr-3" />,
      },
      {
        title: 'Profile',
        path: '/dashboard/profile',
        icon: <User className="h-5 w-5 mr-3" />,
      },
      {
        title: 'Notices',
        path: '/dashboard/notices',
        icon: <Bell className="h-5 w-5 mr-3" />,
      },
    ];

    const studentItems = [
      {
        title: 'Fee Status',
        path: '/dashboard/fee-status',
        icon: <DollarSign className="h-5 w-5 mr-3" />,
      },
      {
        title: 'Study Materials',
        path: '/dashboard/study-materials',
        icon: <FileText className="h-5 w-5 mr-3" />,
      },
    ];

    const teacherItems = [
      {
        title: 'Upload Materials',
        path: '/dashboard/upload-materials',
        icon: <Upload className="h-5 w-5 mr-3" />,
      },
      {
        title: 'My Students',
        path: '/dashboard/my-students',
        icon: <Users className="h-5 w-5 mr-3" />,
      },
    ];

    const adminItems = [
      {
        title: 'All Students',
        path: '/dashboard/all-students',
        icon: <Users className="h-5 w-5 mr-3" />,
      },
      {
        title: 'Manage Notices',
        path: '/dashboard/manage-notices',
        icon: <Bell className="h-5 w-5 mr-3" />,
      },
      {
        title: 'Fee Management',
        path: '/dashboard/fee-management',
        icon: <DollarSign className="h-5 w-5 mr-3" />,
      },
    ];

    if (user?.role === 'admin') {
      return [...commonItems, ...adminItems];
    } else if (user?.role === 'teacher') {
      return [...commonItems, ...teacherItems];
    } else {
      return [...commonItems, ...studentItems];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="h-screen flex flex-col bg-white border-r">
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold font-poppins text-navy-500">Bloom</span>
          <span className="text-xl font-bold font-poppins text-teal-500">Scholar</span>
        </Link>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-navy-500 flex items-center justify-center text-white font-semibold mr-3">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">{user?.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-grow p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                  item.path
                )}`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-4 border-t">
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard/settings"
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                  '/dashboard/settings'
                )}`}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={logout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
