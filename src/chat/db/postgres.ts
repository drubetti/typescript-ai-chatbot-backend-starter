import type { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import checkpointer from '../ai/checkpointer';
import type {
	ChatLocker,
	ChatUnlocker,
	StaleLocksRemover,
	StoredMessagesClose,
	StoredMessagesDeleter,
	StoredMessagesGetter,
	StoredMessagesInit,
	StoredMessagesSaver,
} from '../interfaces';

export const closeDb: StoredMessagesClose = () => Promise.resolve();

export const deleteMessages: StoredMessagesDeleter = () => Promise.resolve(0);

export const getMessages: StoredMessagesGetter = () => Promise.resolve([]);

export const initDb: StoredMessagesInit = async () =>
	checkpointer && (await (checkpointer as PostgresSaver).setup());

export const lockChat: ChatLocker = () => Promise.resolve(true);

export const removeStaleLocks: StaleLocksRemover = () => Promise.resolve(0);

export const saveMessages: StoredMessagesSaver = () => Promise.resolve();

export const unlockChat: ChatUnlocker = () => Promise.resolve();
