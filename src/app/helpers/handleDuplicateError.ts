// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { TGenericErrorResponse } from "../interfaces/error.types";

// Handle duplicate key errors from MongoDB (e.g., email already exists)
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/); 
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exists!!`
    };
};