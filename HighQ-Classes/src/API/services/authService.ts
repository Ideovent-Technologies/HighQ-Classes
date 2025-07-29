import api from '../Axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  mobile: string;
  
  // Student-specific fields
  gender?: string;
  dateOfBirth?: string;
  parentName?: string;
  parentContact?: string;
  grade?: string;
  schoolName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  // Teacher-specific fields
  employeeId?: string;
  qualification?: string;
  experience?: number;
  specialization?: string;
  department?: string;
  bio?: string;
  
  // Admin-specific fields
  designation?: string;
  accessLevel?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  phone?: string;
  avatar?: string;
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      this.clearAuth();
    }
    return null;
  }

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    const response = await api.put('/auth/profile', data);
    
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  // Change password
  async changePassword(data: ChangePasswordData): Promise<AuthResponse> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }

  // Verify email
  async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<AuthResponse> {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Get stored user data
  getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Check user role
  hasRole(role: string): boolean {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  // Check if user is student
  isStudent(): boolean {
    return this.hasRole('student');
  }

  // Check if user is teacher
  isTeacher(): boolean {
    return this.hasRole('teacher');
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }
}

export default new AuthService();
