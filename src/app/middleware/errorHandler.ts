import { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Mongoose ValidationError
  if (err instanceof MongooseError.ValidationError) {
    const formattedErrors: Record<string, any> = {};

    for (const key in err.errors) {
      const fieldError = err.errors[key] as MongooseError.ValidatorError;

      formattedErrors[key] = {
        message: fieldError.message,
        name: fieldError.name,
        properties: {
          message: fieldError.properties?.message,
          type: fieldError.properties?.type,
          min: (fieldError.properties as { min?: number })?.min,
        },
        kind: fieldError.kind,
        path: fieldError.path,
        value: fieldError.value,
      };
    }

    return void res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: err.name,
        errors: formattedErrors,
      },
    });
  }

  // Mongoose CastError
  if (err instanceof MongooseError.CastError) {
    return void res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: "ValidationError",
        errors: {
          [err.path]: {
            message: err.message,
            name: "CastError",
            properties: {
              message: err.message,
              type: "cast",
              min: undefined,
            },
            kind: err.kind,
            path: err.path,
            value: err.value,
          },
        },
      },
    });
  }

  // Mongo duplicate key error
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];

    return void res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: "ValidationError",
        errors: {
          [field]: {
            message: `${field} must be unique`,
            name: "ValidatorError",
            properties: {
              message: `${field} must be unique`,
              type: "unique",
              min: undefined,
            },
            kind: "unique",
            path: field,
            value,
          },
        },
      },
    });
  }

  // Fallback for other errors
  return void res.status(500).json({
    message: "An unexpected error occurred",
    success: false,
    error: {
      name: err?.name || "Error",
      errors: {
        message: err?.message || "Internal Server Error",
      },
    },
  });
};

export default errorHandler;
