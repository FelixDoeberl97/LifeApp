import { verifyToken } from "../services/authService.js";

export function authMiddleware(request, response, next) {
  const authorizationHeader = request.headers.authorization ?? "";
  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice(7)
    : "";

  if (!token) {
    return response.status(401).json({ message: "Authentication token is required." });
  }

  try {
    const payload = verifyToken(token);
    request.user = {
      id: payload.userId,
      email: payload.email
    };
    return next();
  } catch {
    return response.status(401).json({ message: "Authentication token is invalid." });
  }
}
