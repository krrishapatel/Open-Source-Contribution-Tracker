export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFound(message = "Resource not found") {
  return new ApiError(404, message);
}

export function forbidden(message = "You do not have access to this resource") {
  return new ApiError(403, message);
}
