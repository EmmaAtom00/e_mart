export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    details?: Record<string, any>;
}

export class AppError extends Error {
    constructor(
        public message: string,
        public code: string = "UNKNOWN_ERROR",
        public status: number = 500,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = "AppError";
    }
}

export const handleApiError = (error: any): ApiError => {
    // Handle network errors
    if (!navigator.onLine) {
        return {
            message: "No internet connection. Please check your network.",
            code: "NETWORK_ERROR",
            status: 0,
        };
    }

    // Handle fetch errors
    if (error instanceof TypeError) {
        return {
            message: "Network error. Please try again.",
            code: "NETWORK_ERROR",
            status: 0,
        };
    }

    // Handle API response errors
    if (error.status) {
        switch (error.status) {
            case 400:
                return {
                    message: error.message || "Invalid request. Please check your input.",
                    code: "BAD_REQUEST",
                    status: 400,
                    details: error.details,
                };
            case 401:
                return {
                    message: "Session expired. Please sign in again.",
                    code: "UNAUTHORIZED",
                    status: 401,
                };
            case 403:
                return {
                    message: "You don't have permission to perform this action.",
                    code: "FORBIDDEN",
                    status: 403,
                };
            case 404:
                return {
                    message: "The requested resource was not found.",
                    code: "NOT_FOUND",
                    status: 404,
                };
            case 409:
                return {
                    message: error.message || "This resource already exists.",
                    code: "CONFLICT",
                    status: 409,
                };
            case 422:
                return {
                    message: "Validation failed. Please check your input.",
                    code: "VALIDATION_ERROR",
                    status: 422,
                    details: error.details,
                };
            case 429:
                return {
                    message: "Too many requests. Please try again later.",
                    code: "RATE_LIMIT",
                    status: 429,
                };
            case 500:
                return {
                    message: "Server error. Please try again later.",
                    code: "SERVER_ERROR",
                    status: 500,
                };
            case 503:
                return {
                    message: "Service temporarily unavailable. Please try again later.",
                    code: "SERVICE_UNAVAILABLE",
                    status: 503,
                };
            default:
                return {
                    message: error.message || "An error occurred. Please try again.",
                    code: "API_ERROR",
                    status: error.status,
                };
        }
    }

    // Handle generic errors
    if (error instanceof Error) {
        return {
            message: error.message || "An unexpected error occurred.",
            code: "UNKNOWN_ERROR",
            status: 500,
        };
    }

    return {
        message: "An unexpected error occurred. Please try again.",
        code: "UNKNOWN_ERROR",
        status: 500,
    };
};

export const getErrorMessage = (error: any): string => {
    const apiError = handleApiError(error);
    return apiError.message;
};

export const isNetworkError = (error: any): boolean => {
    return !navigator.onLine || error instanceof TypeError || error.code === "NETWORK_ERROR";
};

export const isAuthError = (error: any): boolean => {
    return error.status === 401 || error.code === "UNAUTHORIZED";
};

export const isValidationError = (error: any): boolean => {
    return error.status === 422 || error.code === "VALIDATION_ERROR";
};
