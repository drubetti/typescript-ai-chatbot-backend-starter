import type { NextFunction, Request, Response } from 'express';
import { deleteMessages } from '../db';
import type { DeleteMessagesParamsSchema } from '../schemas';

export default async (
	req: Request<DeleteMessagesParamsSchema>,
	res: Response,
	next: NextFunction,
) => {
	const { chatId } = req.params;

	try {
		const deleted = await deleteMessages(chatId);
		res.send({ deleted });
	} catch (e) {
		next(e);
	}
};
