const { v4: uuidv4 } = require('uuid');

/**
 * AuthController handles authentication-related endpoints.
 */
class AuthController {
  // PUBLIC_INTERFACE
  /**
   * Handle mock login.
   * Accepts email and password in the request body and returns a mock token and user payload.
   * This is a stub for development and always returns success regardless of the input.
   *
   * Request Body:
   * - email (string): User email
   * - password (string): User password
   *
   * Response (200):
   * {
   *   "token": "string",
   *   "user": {
   *     "id": "string",
   *     "email": "string",
   *     "name": "string"
   *   }
   * }
   */
  login(req, res) {
    const { email, password } = req.body || {};

    // Generate a mock token and user
    const userId = uuidv4();
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    // Use provided email or fallback mock
    const safeEmail = typeof email === 'string' && email.trim() ? email.trim() : 'user@example.com';

    const response = {
      token,
      user: {
        id: userId,
        email: safeEmail,
        name: 'Mock User',
      },
    };

    return res.status(200).json(response);
  }
}

module.exports = new AuthController();
