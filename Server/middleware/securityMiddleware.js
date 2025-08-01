import mongoSanitize from 'express-mongo-sanitize';

/**
 * Security middleware for preventing NoSQL injection attacks
 */
export const sanitizeRequest = mongoSanitize({
    onSanitize: ({ req, key }) => {
        console.warn(`This request[${key}] is sanitized`, req[key]);
    },
});

/**
 * Custom XSS protection middleware
 * Replaces potentially dangerous characters in request data
 */
export const xssClean = (req, res, next) => {
    const xssRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

    const cleanObject = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    obj[key] = obj[key].replace(xssRegex, '');
                    obj[key] = obj[key].replace(/[<>]/g, '');
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    cleanObject(obj[key]);
                }
            }
        }
    };

    if (req.body) cleanObject(req.body);
    if (req.query) cleanObject(req.query);
    if (req.params) cleanObject(req.params);

    next();
};

/**
 * Rate limiting configuration for different endpoints
 */
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
    return {
        windowMs,
        max,
        message: {
            success: false,
            message
        },
        standardHeaders: true,
        legacyHeaders: false,
    };
};

/**
 * Specific rate limiters for different types of requests
 */
export const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts
    'Too many login attempts, please try again after 15 minutes'
);

export const generalLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests
    'Too many requests from this IP, please try again later'
);

export const passwordResetLimiter = createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3, // 3 attempts
    'Too many password reset attempts, please try again after 1 hour'
);

export default {
    sanitizeRequest,
    xssClean,
    createRateLimiter,
    authLimiter,
    generalLimiter,
    passwordResetLimiter
};
