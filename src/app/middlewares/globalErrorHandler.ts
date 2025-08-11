/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { TErrorSources } from '../interfaces/error.types';
import AppError from '../errors/AppError';
import config from '../config';
import { handlerDuplicateError } from '../helpers/handleDuplicateError';
import { handleCastError } from '../helpers/handleCastError';
import { handlerZodError } from '../helpers/handlerZodError';
import { handlerValidationError } from '../helpers/handlerValidationError';

const globalErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

	// Default error values
	let statusCode = 500;
	let message = "Something Went Wrong!!";
	let errorSources: TErrorSources[] = [];

  	// Handle MongoDB duplicate key error
	if (err.code === 11000) {
		const simplifiedError = handlerDuplicateError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
	}

	// Handle invalid MongoDB ObjectId (CastError)
	else if (err.name === "CastError") {
		const simplifiedError = handleCastError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
	}

	// Handle Zod schema validation error
	else if (err.name === "ZodError") {
		const simplifiedError = handlerZodError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources as TErrorSources[];
	}

	// Handle Mongoose Schema validation error
	else if (err.name === "ValidationError") {
		const simplifiedError = handlerValidationError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources as TErrorSources[];
	}

	// Handle our custom error-handler-class error (throw new AppError(404,"Something went wrong"))
	else if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	}

	// Handle default errors (throw new Error("Something went wrong"))
	else if (err instanceof Error) {
		statusCode = 500;
		message = err.message;
	}

	// Send error response
	res.status(statusCode).json({
		success: false,
		message,
		errorSources,
		// err: envVars.NODE_ENV === "development" ? err : null,
		// stack: envVars.NODE_ENV === "development" ? err.stack : null
	});
};

export default globalErrorHandler;