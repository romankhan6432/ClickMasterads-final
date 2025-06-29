 
import { MongoError } from 'mongodb';

interface ErrorResponse {
    error?: string;
    message?: string;
    status?: number;
}

interface MongoErrorResponse extends MongoError {
    code?: number;
    keyPattern?: Record<string, number>;
    keyValue?: Record<string, any>;
    error?: string;
    status?: number;
}

type ApiError = ErrorResponse | MongoErrorResponse;

export const handleApiError = (error: ApiError) => {
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if ('code' in error) {
        // Handle MongoDB specific errors
        switch (error.code) {
            case 11000: // Duplicate key error
                const field = Object.keys(error.keyPattern || {})[0];
                const value = error.keyValue?.[field];
                errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already taken`;
                statusCode = 409;
                break;
            default:
                errorMessage = error.message || 'Database error occurred';
        }
    } else {
        // Handle general API errors
        errorMessage = error.error || error.message || errorMessage;
        statusCode = error.status || statusCode;
    }

    return {
        error: errorMessage,
        status: statusCode
    };
};

export const handleValidationError = (error: any) => {
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return {
            error: errors.join(', '),
            status: 400
        };
    }
    return handleApiError(error);
};

export const handleApiSuccess = (successMessage: string) => {
    //message.success(successMessage);
    return {
        message: successMessage,
        status: 200
    };
};