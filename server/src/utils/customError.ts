class CustomError extends Error {
  status: string;

  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = "CustomError";
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
