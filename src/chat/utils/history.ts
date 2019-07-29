import { getMessages, saveMessages } from '../db';
import { type DbMessage, type Message, MessageRole } from '../interfaces';

export const getHistory = async (
	chatId: DbMessage['chatId'],
): Promise<Message[]> => {
	const history = await getMessages(chatId);
	// Here we expect the messages to be sorted from newer to older.
	const olderMessage = history.length ? history[history.length - 1] : undefined;
	// If the older message was an answer from the LLM, discard it,
	// since it may be meaningless without the original question.
	// The DB may return a limited list of messages, but we expect them to
	// always be sorted from newer to older.
	if (olderMessage?.role === MessageRole.Assistant) history.pop();

	// Reverse the history because the LLM wants it sorted from older to newer.
	return [...history].reverse().map(({ content, role }) => ({ content, role }));
};

export const persistHistory = async (messages: DbMessage[]) => {
	await saveMessages(messages);
};
