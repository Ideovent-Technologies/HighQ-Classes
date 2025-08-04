import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console or external service
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // TODO: Log to external error reporting service
        // logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    handleTryAgain = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 text-red-500">
                                <AlertTriangle className="h-full w-full" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Oops! Something went wrong
                            </CardTitle>
                            <p className="text-gray-600">
                                We apologize for the inconvenience. An
                                unexpected error has occurred.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === "development" &&
                                this.state.error && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <h4 className="text-sm font-medium text-red-800 mb-2">
                                            Error Details (Development Mode)
                                        </h4>
                                        <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                                            {this.state.error.message}
                                            {
                                                this.state.errorInfo
                                                    ?.componentStack
                                            }
                                        </pre>
                                    </div>
                                )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={this.handleTryAgain}
                                    className="flex items-center space-x-2"
                                    variant="default"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span>Try Again</span>
                                </Button>

                                <Button
                                    onClick={this.handleReload}
                                    variant="outline"
                                    className="flex items-center space-x-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span>Reload Page</span>
                                </Button>

                                <Button
                                    onClick={this.handleGoHome}
                                    variant="ghost"
                                    className="flex items-center space-x-2"
                                >
                                    <Home className="h-4 w-4" />
                                    <span>Go Home</span>
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                If the problem persists, please contact support.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component wrapper for functional components
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary fallback={fallback}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${
        Component.displayName || Component.name
    })`;

    return WrappedComponent;
};

export default ErrorBoundary;
