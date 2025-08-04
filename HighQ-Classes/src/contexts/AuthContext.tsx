import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    ReactNode,
} from "react";
import authService, {
    User,
    LoginCredentials,
    RegisterData,
    UpdateProfileData,
    ChangePasswordData,
} from "../API/services/authService";

// Define the auth state
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Define auth actions
type AuthAction =
    | { type: "AUTH_START" }
    | { type: "AUTH_SUCCESS"; payload: User }
    | { type: "AUTH_ERROR"; payload: string }
    | { type: "AUTH_LOGOUT" }
    | { type: "CLEAR_ERROR" }
    | { type: "REGISTER_SUCCESS" }
    | { type: "UPDATE_USER"; payload: User };

// Define the context type
 export interface AuthContextType {
    state: AuthState;
    login: (
        credentials: LoginCredentials
    ) => Promise<{ success: boolean; user?: User }>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<boolean>;
    changePassword: (data: ChangePasswordData) => Promise<boolean>;
    clearError: () => void;
}

// Initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "AUTH_START":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case "AUTH_SUCCESS":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case "AUTH_ERROR":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case "AUTH_LOGOUT":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case "UPDATE_USER":
            return {
                ...state,
                user: action.payload,
            };
        case "REGISTER_SUCCESS":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case "CLEAR_ERROR":
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is already authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const user = await authService.getCurrentUser();

                    if (user) {
                        dispatch({ type: "AUTH_SUCCESS", payload: user });
                    } else {
                        dispatch({ type: "AUTH_LOGOUT" });
                    }
                } else {
                    dispatch({ type: "AUTH_LOGOUT" });
                }
            } catch (error) {
                console.error("Auth check error:", error);
                dispatch({ type: "AUTH_LOGOUT" });
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (
        credentials: LoginCredentials
    ): Promise<{ success: boolean; user?: User }> => {
        try {
            dispatch({ type: "AUTH_START" });
            const response = await authService.login(credentials);

            if (response.success && response.user) {
                dispatch({ type: "AUTH_SUCCESS", payload: response.user });
                return { success: true, user: response.user };
            } else {
                dispatch({
                    type: "AUTH_ERROR",
                    payload: response.message || "Login failed",
                });
                return { success: false };
            }
        } catch (error: unknown) {
            console.error("Login error:", error);
            const errorMessage =
                error instanceof Error && "response" in error
                    ? (error as { response?: { data?: { message?: string } } })
                          .response?.data?.message || "Login failed"
                    : "Login failed";
            dispatch({ type: "AUTH_ERROR", payload: errorMessage });
            return { success: false };
        }
    };

    // Register function
    const register = async (userData: RegisterData): Promise<boolean> => {
        try {
            dispatch({ type: "AUTH_START" });
            const response = await authService.register(userData);

            if (response.success) {
                // Registration successful but user needs approval (except admin)
                // Don't set user as authenticated until approved
                // Clear any errors and set loading to false
                dispatch({ type: "REGISTER_SUCCESS" });
                return true;
            } else {
                dispatch({
                    type: "AUTH_ERROR",
                    payload: response.message || "Registration failed",
                });
                return false;
            }
        } catch (error: unknown) {
            const errorMessage = "Registration failed";
            dispatch({ type: "AUTH_ERROR", payload: errorMessage });
            return false;
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            dispatch({ type: "AUTH_LOGOUT" });
        }
    };

    // Update profile function
    const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
        try {
            const response = await authService.updateProfile(data);

            if (response.success && response.user) {
                dispatch({ type: "UPDATE_USER", payload: response.user });
                return true;
            } else {
                dispatch({
                    type: "AUTH_ERROR",
                    payload: response.message || "Profile update failed",
                });
                return false;
            }
        } catch (error: unknown) {
            const errorMessage = "Profile update failed";
            dispatch({ type: "AUTH_ERROR", payload: errorMessage });
            return false;
        }
    };

    // Change password function
    const changePassword = async (
        data: ChangePasswordData
    ): Promise<boolean> => {
        try {
            const response = await authService.changePassword(data);

            if (response.success) {
                return true;
            } else {
                dispatch({
                    type: "AUTH_ERROR",
                    payload: response.message || "Password change failed",
                });
                return false;
            }
        } catch (error: unknown) {
            const errorMessage = "Password change failed";
            dispatch({ type: "AUTH_ERROR", payload: errorMessage });
            return false;
        }
    };

    // Clear error function
    const clearError = (): void => {
        dispatch({ type: "CLEAR_ERROR" });
    };

    const value: AuthContextType = {
        state,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthContext;
