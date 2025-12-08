/**
 * CORS middleware for Firebase Functions
 * Handles preflight requests and adds CORS headers to all responses
 */
function handleCors(req, res) {
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "3600");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true; // Signal that CORS preflight was handled
  }

  return false; // Continue processing the request
}

module.exports = handleCors;
