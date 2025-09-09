export class AppError extends Error {
  public statusCode: number;

  constructor(message = "Something went wrong", statusCode = 400) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}