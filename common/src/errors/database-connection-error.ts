import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Failed to connect to database";
  statusCode: number = 500;

  constructor() {
    super("Database connection error");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.reason }];
  }
}
