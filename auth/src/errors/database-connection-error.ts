import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Failed to connect to database";
  statusCode = 500;

  constructor() {
    super("Database connection error");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
