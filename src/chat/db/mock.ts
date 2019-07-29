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

export const initDb: StoredMessagesInit = () => Promise.resolve();

export const lockChat: ChatLocker = () => Promise.resolve(true);

export const removeStaleLocks: StaleLocksRemover = () => Promise.resolve(0);

export const saveMessages: StoredMessagesSaver = () => Promise.resolve();

export const unlockChat: ChatUnlocker = () => Promise.resolve();
