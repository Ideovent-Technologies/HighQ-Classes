// Authentication Components
export { default as Login } from '../pages/auth/Login';
export { default as Register } from '../pages/auth/Register';
export { default as Profile } from '../pages/auth/Profile';
export { default as ForgotPassword } from '../pages/auth/ForgotPassword';

// Authentication Context & Hook
export { AuthProvider } from '../contexts/AuthContext';
export { useAuth } from '../hooks/useAuth';

// Authentication Service
export { default as authService } from '../API/services/authService';

// Components
export { default as ProtectedRoute } from '../components/ProtectedRoute';
export { default as AuthNavigation } from '../components/AuthNavigation';

// Types
export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UpdateProfileData,
  ChangePasswordData,
  ForgotPasswordData,
  ResetPasswordData,
} from '../API/services/authService';
