import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  UserCircle, Bell, BookOpen, Calendar, FileText, Video, Clipboard,
} from "lucide-react";

// --- Static data examples (replace with props/context/API calls as needed) ---

const summaryCards = [
  { label: "Notices", value: 4, icon: <Bell className="w-7 h-7 text-blue-500" /> },
  { label: "Attendance %", value: "80%", icon: <Clipboard className="w-7 h-7 text-green-600" /> },
  { label: "Today Classes", value: 2, icon: <Calendar className="w-7 h-7 text-violet-600" /> },
  { label: "Recordings", value: 3, icon: <Video className="w-7 h-7 text-yellow-500" /> },
];
const todayClasses = [
  { time: "10:00 - 11:30", subject: "Computer Science Engineering" },
  { time: "14:00 - 15:30", subject: "MERN Fullstack" },
];
const latestNotice = {
  title: "Welcome to HighQ Classes!",
  description: "Your dashboard is now set up with sample data. Start exploring your courses and schedule.",
};

const sidebarLinks = [
  { to: ".", label: "Dashboard", icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { to: "notices", label: "Notices", icon: <Bell className="w-5 h-5 mr-2" /> },
  { to: "attendance", label: "Attendance", icon: <Clipboard className="w-5 h-5 mr-2" /> },
  { to: "schedule", label: "Schedule", icon: <Calendar className="w-5 h-5 mr-2" /> },
  { to: "recordings", label: "Recordings", icon: <Video className="w-5 h-5 mr-2" /> },
  { to: "profile", label: "Profile", icon: <UserCircle className="w-5 h-5 mr-2" /> },
];

// --- Main Component --- //

const StudentDashboard: React.FC = () => {
  const location = useLocation();
  // get last path segment for sidebar highlighting
  const segments = location.pathname.split("/");
  const activeRoute = segments[segments.length - 1] || "."; // for index route

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-20 flex items-center pl-7 border-b select-none">
          <span className="font-extrabold text-2xl text-blue-600">
            Bloom<span className="text-gray-700">Scholar</span>
          </span>
        </div>
        {/* Profile area */}
        <div className="flex flex-col items-center border-b pt-5 pb-5 bg-gray-50">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <UserCircle className="w-10 h-10 text-blue-500" />
          </div>
          <div className="font-semibold">Student Name</div>
          <div className="text-xs text-gray-400">Student</div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center px-8 py-2 rounded-lg transition-colors ${
                    // handle both "/" (dashboard home) and real route names
                    (activeRoute === link.to || (link.to === "." && (activeRoute === "." || activeRoute === "dashboard")))
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Bottom action (Logout) */}
        <div className="mt-auto mb-7 px-8">
          <button className="w-full py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium text-base transition">Logout</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 md:p-12">
        <div className="mb-2 flex items-center gap-x-4">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          {/* optional: role badge */}
          <span className="ml-2 text-xs px-2.5 py-1 rounded bg-blue-100 text-blue-700 font-semibold lowercase">Student</span>
        </div>
        <p className="text-gray-500 mb-7">Welcome back, Student Name!</p>

        {/* Summary cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {summaryCards.map((card) => (
            <div className="rounded-xl bg-white shadow px-7 py-5 flex items-center gap-x-5" key={card.label}>
              <div className="">{card.icon}</div>
              <div>
                <div className="text-xl font-semibold">{card.value}</div>
                <div className="text-xs text-gray-500">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Subpage content or dashboard overview */}
        <div className="bg-white shadow rounded-xl p-7 min-h-[250px]">
          {activeRoute !== "." && activeRoute !== "dashboard" ? (
            <Outlet />
          ) : (
            <>
              {/* Main dashboard summary (class schedule and notice) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-500" />
                    Today's Classes
                  </h2>
                  <ul className="mb-6">
                    {todayClasses.map((c, i) => (
                      <li key={i} className="mb-2">
                        <span className="font-semibold">{c.time}:</span>{" "}
                        {c.subject}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Latest Notice
                  </h2>
                  <div className="mb-0 p-4 rounded bg-blue-50 border-l-4 border-blue-400 text-blue-900">
                    <div className="font-semibold">{latestNotice.title}</div>
                    <div className="mt-1 text-sm">{latestNotice.description}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
