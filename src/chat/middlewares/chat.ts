import { conflictError } from '@utils/serverErrors';
import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import { getAiResponseGenerator } from '../ai';
import { lockChat, unlockChat } from '../db';
import { MessageRole } from '../interfaces';
import type { ChatBodySchema } from '../schemas';
import { getHistory, persistHistory } from '../utils';

export default async (
	req: Request<ParamsDictionary, ChatBodySchema>,
	res: Response,
	next: NextFunction,
) => {
	const { chatId, message: question } = req.body as ChatBodySchema;
	const startedAt = new Date();
	let isLockingSuccessful = false;

	try {
		isLockingSuccessful = await lockChat(chatId);
		if (!isLockingSuccessful) return next(conflictError());

		const messages = await getHistory(chatId);
		messages.push({ content: question, role: MessageRole.User });

		const responseGenerator = getAiResponseGenerator({ chatId, messages });
		let done: boolean | undefined = false;
		let value = '';
		const chars: string[] = [];

		res.set('Content-Type', 'text/plain');

		while (!done) {
			({ done, value } = await responseGenerator.next());
			if (value) {
				chars.push(value);
				res.write(value);
			}
		}

		const response = chars.join('');
		let endedAt = new Date();

		if (endedAt.getTime() === startedAt.getTime()) {
			// Ensure that the answer is always saved after the question.
			endedAt = new Date(endedAt.getTime() + 1);
		}

		await persistHistory([
			{
				chatId,
				content: question,
				date: startedAt,
				role: MessageRole.User,
			},
			{
				chatId,
				content: response,
				date: endedAt,
				role: MessageRole.Assistant,
			},
		]);
		await unlockChat(chatId);
	} catch (e) {
		next(e);
	} finally {
		isLockingSuccessful && res.end(); // Close the stream and set response headers.
	}
};
