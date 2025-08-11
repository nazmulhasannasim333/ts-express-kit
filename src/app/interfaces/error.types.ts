export type TErrorSources = {
	path: string | number;
	message: string;
};

export type TGenericErrorResponse = {
	statusCode: number;
	message: string;
	errorSources?: TErrorSources[]; // Name of the errors field for, "Mongoose Schema and Zod schema" validation
};
