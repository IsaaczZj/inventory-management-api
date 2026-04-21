export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "App Error";

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
