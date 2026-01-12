import React from 'react';

/**
 * Formats a date string into a more readable format (e.g., "Jan 10, 2026")
 */
export const formatDate = (dateString = '') => {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        return 'N/A';
    }
};

/**
 * A simple loading spinner component
 */
export const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4'
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-t-transparent border-black`}
            ></div>
        </div>
    );
};
