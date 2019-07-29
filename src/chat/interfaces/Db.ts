import type { DbMessage } from './Message';

export enum Collection {
	Locks = 'locks',
	Messages = 'messages',
}

export enum DbType {
	Memory = 'memory',
	MongoDB = 'mongodb',
	PostgreSQL = 'postgresql',
}

export type ChatLocker = (chatId: string) => Promise<boolean>;

export type ChatUnlocker = (chatId: string) => Promise<void>;

export type StaleLocksRemover = () => Promise<number>;

export type StoredMessagesGetter = (
	chatId: DbMessage['chatId'],
	limit?: number,
) => Promise<DbMessage[]>;

export type StoredMessagesDeleter = (chatId: string) => Promise<number>;

export type StoredMessagesClose = (force?: boolean) => Promise<void>;

export type StoredMessagesInit = () => Promise<void>;

export type StoredMessagesSaver = (messages: DbMessage[]) => Promise<void>;

export interface Db {
	closeDb: StoredMessagesClose;
	getMessages: StoredMessagesGetter;
	deleteMessages: StoredMessagesDeleter;
	initDb: StoredMessagesInit;
	lockChat: ChatLocker;
	removeStaleLocks: StaleLocksRemover;
	saveMessages: StoredMessagesSaver;
	unlockChat: ChatUnlocker;
}
