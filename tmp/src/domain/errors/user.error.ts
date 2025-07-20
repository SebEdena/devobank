export interface UserEmailAlreadyInUseError extends Error {
  name: "user.emailAlreadyInUse";
  message: string;
  email: string;
}

export function UserEmailAlreadyInUseError(email: string): UserEmailAlreadyInUseError {
  const error = new Error(`User email already in use: ${email}`) as UserEmailAlreadyInUseError;
  error.name = "user.emailAlreadyInUse";
  error.email = email;
  return error;
}

export interface UserNotFoundError extends Error {
  name: "user.notFound";
  message: string;
  email: string;
}

export function UserNotFoundError(email: string): UserNotFoundError {
  const error = new Error(`User not found: ${email}`) as UserNotFoundError;
  error.name = "user.notFound";
  error.email = email;
  return error;
}

export interface UserPasswordMismatchError extends Error {
  name: "user.passwordMismatch";
  message: string;
}

export function UserPasswordMismatchError(): UserPasswordMismatchError {
  const error = new Error("User password mismatch") as UserPasswordMismatchError;
  error.name = "user.passwordMismatch";
  return error;
}

export interface LoginError extends Error {
  name: "user.loginError";
  message: string;
}

export function LoginError(message: string): LoginError {
  const error = new Error(message) as LoginError;
  error.name = "user.loginError";
  return error;
}
