import type { NextFunction, Request, Response } from 'express';
import { getMessages } from '../db';
import type { GetMessagesParamsSchema } from '../schemas';

export default async (
	req: Request<GetMessagesParamsSchema>,
	res: Response,
	next: NextFunction,
) => {
	const { chatId } = req.params;

	try {
		const messagesFromNewer = await getMessages(chatId, 0);
		res.send(messagesFromNewer.reverse());
	} catch (e) {
		next(e);
	}
};
