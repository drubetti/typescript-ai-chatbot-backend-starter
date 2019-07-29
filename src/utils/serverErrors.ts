interface ServerErrorParams {
	hideMessage?: boolean;
	message?: string;
	statusCode?: number;
}

export const createServerError = ({
	hideMessage = false,
	message,
	statusCode = 500,
}: ServerErrorParams) => {
	const error = new Error(typeof message === 'string' ? message : undefined);
	return Object.assign(error, {
		hideMessage,
		statusCode,
	});
};

/**
 * @swagger
 * components:
 *   responses:
 *     BadGateway:
 *       description: Bad Gateway.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               statusCode:
 *                 type: integer
 *                 enum: [502]
 */
export const badGatewayError = (message?: string) => {
	return createServerError({ message, statusCode: 502 });
};

/**
 * @swagger
 * components:
 *   responses:
 *     BadRequest:
 *       description: Bad Request.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               statusCode:
 *                 type: integer
 *                 enum: [400]
 */
export const badRequestError = (message?: string) => {
	return createServerError({ message, statusCode: 400 });
};

/**
 * @swagger
 * components:
 *   responses:
 *     Forbidden:
 *       description: Forbidden.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */
export const forbiddenError = (message?: string) => {
	return createServerError({ message, statusCode: 403 });
};

/**
 * @swagger
 * components:
 *   responses:
 *     NotFound:
 *       description: Not found.
 *       content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export const notFoundError = (message?: string) => {
	return createServerError({ message, statusCode: 404 });
};

/**
 * @swagger
 * components:
 *   responses:
 *     Unauthorized:
 *       description: The User is not authorized to perform the request.
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 */
export const unauthorizedError = (message?: string) => {
	return createServerError({ message, statusCode: 401 });
};

/**
 * @swagger
 * components:
 *   responses:
 *     Conflict:
 *       description: The request cannot be performed due to conflict.
 *       content:
 *           text/plain:
 *             schema:
 *               type: string
 */
export const conflictError = (message = 'Conflict') => {
	return createServerError({ message, statusCode: 409 });
};
