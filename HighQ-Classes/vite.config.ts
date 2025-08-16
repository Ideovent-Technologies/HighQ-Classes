import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 👈 change this to match your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          'query-vendor': ['@tanstack/react-query'],
          // Admin chunks
          'admin': [
            './src/components/dashboard/admin/AdminDashboard',
            './src/pages/admin/AdminProfile',
            './src/components/dashboard/admin/AdminAnnouncementPage'
          ],
          // Teacher chunks  
          'teacher': [
            './src/components/dashboard/teacher/MyStudents',
            './src/components/dashboard/teacher/Schedule',
            './src/components/dashboard/teacher/Recordings'
          ],
          // Student chunks
          'student': [
            './src/pages/student/StudentProfile',
            './src/pages/student/MyClasses',
            './src/pages/student/MyFees'
          ]
        }
      }
    }
  }
}));
