const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format.'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is empty.'
      });
    }

    // For now, we'll validate against the current access token from the token service
    // In a real application, you would validate JWT tokens here
    // You can import the token service or make a request to validate the token

    // For demonstration, we'll check if the token exists and has some content
    if (token.length < 10) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Add token to request object for use in route handlers
    req.userToken = token;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

module.exports = authMiddleware; 