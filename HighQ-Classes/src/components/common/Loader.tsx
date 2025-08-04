import React from "react";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
    size = "md",
    text = "Loading...",
    className = "",
}) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    return (
        <div
            className={`flex flex-col items-center justify-center space-y-2 ${className}`}
        >
            <div
                className={`${sizeClasses[size]} border-4 border-gray-300 border-t-4 border-t-blue-600 rounded-full animate-spin`}
            />
            {text && (
                <p className={`text-gray-600 ${textSizeClasses[size]}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

// Full screen loader component
export const FullScreenLoader: React.FC<{ text?: string }> = ({
    text = "Loading...",
}) => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <Loader size="lg" text={text} />
        </div>
    );
};

// Inline loader for smaller sections
export const InlineLoader: React.FC<{ text?: string }> = ({
    text = "Loading...",
}) => {
    return (
        <div className="flex items-center justify-center py-8">
            <Loader size="md" text={text} />
        </div>
    );
};

// Button loader for loading states in buttons
export const ButtonLoader: React.FC = () => {
    return (
        <div className="flex items-center space-x-2">
            <div className="h-4 w-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
        </div>
    );
};

export default Loader;
