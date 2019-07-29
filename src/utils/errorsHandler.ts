import type { NextFunction, Request, Response } from 'express';

const errorsHandler = async (
	// biome-ignore lint: error must be "any"
	err: any,
	req: Request,
	res: Response,
	_next: NextFunction,
) => {
	req.log.error(err);

	// Wait for Express to set "res.headersSent".
	await new Promise((resolve) => setTimeout(resolve));

	// If an error happens after the response headers have already been set,
	// do not send another response, as Express would throw an Error.
	const { headersSent: isResponseAlreadySent } = res;
	if (isResponseAlreadySent) return;

	const { message = '', statusCode = 500 } = err || {};
	res.status(statusCode).send({ message });
};

export default errorsHandler;
