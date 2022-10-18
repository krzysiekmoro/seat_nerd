import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode: number = 400;

  constructor(public errors: ValidationError[]) {
    super("Incorrect request error");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
