import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

interface LazyWrapperProps {
    children?: React.ReactNode;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ children }) => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            {children || <Outlet />}
        </Suspense>
    );
};

export default LazyWrapper;
