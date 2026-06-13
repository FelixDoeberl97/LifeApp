import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";
import { createUser, findUserByEmail } from "../repositories/userRepository.js";

const jwtSecret = process.env.JWT_SECRET || "budget-flow-development-secret";

export async function registerUser(database, userData) {
  const email = String(userData.email ?? "").trim().toLowerCase();
  const password = String(userData.password ?? "");

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "A valid email is required.");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must contain at least 8 characters.");
  }

  const existingUser = await findUserByEmail(database, email);

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(database, { email, passwordHash });
  const token = createToken(user);

  return { user, token };
}

export async function loginUser(database, userData) {
  const email = String(userData.email ?? "").trim().toLowerCase();
  const password = String(userData.password ?? "");
  const user = await findUserByEmail(database, email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = createToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
}

export function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    jwtSecret,
    { expiresIn: "2h" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}
