import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    user: context.state.user,
    isAuthenticated: context.state.isAuthenticated,
    isLoading: context.state.isLoading,
    error: context.state.error,
  };
};
