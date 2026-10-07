# Local Node Setup with Authentication

This project demonstrates a simple Node.js Express server with authentication middleware for protected API endpoints.

## Features

- Express server with body parsing and static file serving
- Token-based authentication middleware
- Protected `/lookupData` API endpoint
- Token management service with auto-refresh
- User and product management routes

## Authentication

The `/lookupData` API endpoint is now protected with authentication middleware. To access it, you must include a valid Bearer token in the Authorization header.

### How to use the protected endpoint:

1. **Get a valid token first:**
   ```bash
   GET /token
   ```

2. **Use the token to access protected endpoint:**
   ```bash
   GET /lookupData
   Authorization: Bearer <your_token_here>
   ```

### Example with curl:

```bash
# Get token
curl http://localhost:3005/token

# Use token to access protected endpoint
curl -H "Authorization: Bearer <token_from_step_1>" http://localhost:3005/lookupData
```

## API Endpoints

### Public Endpoints:
- `GET /token` - Get current access token
- `GET /refresh` - Manually refresh access token
- `POST /validate` - Validate a token

### Protected Endpoints:
- `GET /lookupData` - Get lookup data (requires authentication)

### Other Routes:
- User management routes (`/users`)
- Product management routes (`/products`)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

   Or run directly:
   ```bash
   node app.js
   ```

3. The server will start on port 3005

## Testing Authentication

Run the test script to see the authentication in action:

```bash
node test-auth.js
```

This will test:
- Access without authentication (should fail)
- Access with invalid token (should fail)
- Access with valid token (should succeed)

## Middleware Structure

- **`middleware/auth.js`** - Authentication middleware that validates Bearer tokens
- **`routes/token.js`** - Token management and protected endpoints
- **`app.js`** - Main application setup and route registration

## Security Notes

- The current implementation uses a simple token validation
- In production, you should implement proper JWT validation
- Consider adding rate limiting and additional security measures
- The middleware can be easily extended to validate against a database or external auth service 