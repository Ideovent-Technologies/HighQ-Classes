import { lazy } from 'react';

// Preload utilities for better performance
export const preloadRoute = (routeImport: () => Promise<any>) => {
  const componentImport = routeImport();
  return componentImport;
};

// Critical routes that might need preloading
export const preloadCriticalRoutes = () => {
  // Preload authentication routes
  preloadRoute(() => import('@/pages/auth/Login'));
  preloadRoute(() => import('@/pages/dashboard/Dashboard'));
};

// Preload based on user role
export const preloadRoleBasedRoutes = (role: string) => {
  switch (role) {
    case 'admin':
      preloadRoute(() => import('@/components/dashboard/admin/AdminDashboard'));
      preloadRoute(() => import('@/pages/admin/AdminProfile'));
      break;
    case 'teacher':
      preloadRoute(() => import('@/components/dashboard/teacher/MyStudents'));
      preloadRoute(() => import('@/components/dashboard/teacher/Schedule'));
      break;
    case 'student':
      preloadRoute(() => import('@/pages/student/StudentProfile'));
      preloadRoute(() => import('@/pages/student/MyClasses'));
      break;
  }
};

export default {
  preloadRoute,
  preloadCriticalRoutes,
  preloadRoleBasedRoutes
};
