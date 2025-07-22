/**
 * Middleware to check user roles
 * Ensures the user has appropriate permissions
 */

/**
 * Check if user has required role(s)
 * @param {string|string[]} roles - Single role or array of allowed roles
 * @returns {function} Express middleware
 */
export const checkRole = (roles) => {
    // Convert to array if a single role is passed
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        // Check if user object and role exist (should be set by auth middleware)
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: "Access denied. User role not found."
            });
        }

        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${req.user.role} role not authorized for this operation.`
            });
        }

        // Role check passed, proceed
        next();
    };
};

/**
 * Check if user owns a resource or is an admin
 * @param {string} modelName - Name of the model to check
 * @param {string} paramName - Name of request parameter containing resource ID
 * @param {string} ownerField - Field name in the model representing the owner
 * @returns {function} Express middleware
 */
export const checkOwnership = (modelName, paramName = 'id', ownerField = 'user') => {
    return async (req, res, next) => {
        try {
            // Admin can access any resource
            if (req.user.role === 'admin') {
                return next();
            }

            // Get the model dynamically
            const Model = req.app.get('models')[modelName];

            if (!Model) {
                console.error(`Model ${modelName} not found`);
                return res.status(500).json({
                    success: false,
                    message: 'Server configuration error'
                });
            }

            // Get resource ID from params
            const resourceId = req.params[paramName];

            if (!resourceId) {
                return res.status(400).json({
                    success: false,
                    message: `Missing ${paramName} parameter`
                });
            }

            // Find the resource
            const resource = await Model.findById(resourceId);

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
            }

            // Check ownership
            if (resource[ownerField].toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You do not own this resource.'
                });
            }

            // Set resource in request for possible later use
            req.resource = resource;

            // Ownership check passed, proceed
            next();
        } catch (error) {
            console.error('Ownership check error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during access check',
                error: error.message
            });
        }
    };
};