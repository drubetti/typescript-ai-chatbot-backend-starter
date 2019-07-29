import { dbConnectionString, dbHistoryLimit, dbName } from '@utils/env';
import moment from 'moment';
import { type FindOptions, MongoClient, type MongoServerError } from 'mongodb';
import { logger } from '../../utils';
import {
	type ChatLocker,
	type ChatUnlocker,
	Collection,
	type DbMessage,
	type Lock,
	LockType,
	type StaleLocksRemover,
	type StoredMessagesClose,
	type StoredMessagesDeleter,
	type StoredMessagesGetter,
	type StoredMessagesInit,
	type StoredMessagesSaver,
} from '../interfaces';

const MONGODB_DUPLICATE_KEY_ERROR_CODE = 11000;

let client: MongoClient | undefined;

export const closeDb: StoredMessagesClose = async (force) => {
	try {
		if (!client) return;

		logger.info('Closing DB connection...');
		await client.close(force);
		logger.info('DB connection closed.');
	} catch (e) {
		logger.error(e);
	}
};

export const getMessages: StoredMessagesGetter = async (
	chatId: DbMessage['chatId'],
	limit = dbHistoryLimit,
) => {
	try {
		client ||= new MongoClient(dbConnectionString);
		const database = client.db(dbName);
		const collection = database.collection<DbMessage>(Collection.Messages);
		const query = { chatId };
		const options: FindOptions<DbMessage> = {
			limit,
			projection: { _id: false },
			sort: { date: -1 },
		};

		return await collection.find(query, options).toArray();
	} catch (e) {
		logger.error(e);
		return [];
	}
};

export const initDb: StoredMessagesInit = async () => {
	try {
		client ||= new MongoClient(dbConnectionString);
		const database = client.db(dbName);
		const locksCollection = database.collection<Lock>(Collection.Locks);
		const messagesCollection = database.collection<DbMessage>(
			Collection.Messages,
		);
		await Promise.all([
			await locksCollection.createIndex({ date: 1 }),
			await locksCollection.createIndex(
				{ type: 1, chatId: 1 },
				{ unique: true },
			),
			await messagesCollection.createIndex({ chatId: 1, date: -1 }),
		]);
	} catch (e) {
		logger.error(e);
	}
};

export const lockChat: ChatLocker = async (chatId) => {
	if (!chatId) return false;
	try {
		client ||= new MongoClient(dbConnectionString);
		const database = client.db(dbName);
		const collection = database.collection<Lock>(Collection.Locks);
		await collection.insertOne({
			chatId,
			date: new Date(),
			type: LockType.Chat,
		});
		return true;
	} catch (e) {
		const mongoError = e as MongoServerError;
		if (mongoError?.errorResponse?.code !== MONGODB_DUPLICATE_KEY_ERROR_CODE) {
			logger.error(e);
		}
		return false;
	}
};

export const removeStaleLocks: StaleLocksRemover = async () => {
	try {
		client ||= new MongoClient(dbConnectionString);
		const database = client.db(dbName);
		const collection = database.collection<Lock>(Collection.Locks);
		const { deletedCount } = await collection.deleteMany({
			date: {
				$lt: moment().subtract(1, 'minute').toDate(),
			},
		});
		return deletedCount;
	} catch (e) {
		logger.error(e);
		return 0;
	}
};

export const deleteMessages: StoredMessagesDeleter = async (chatId: string) => {
	if (!chatId) return 0;
	try {
		client ||= new MongoClient(dbConnectionString);
		const database = client.db(dbName);
		const collection = database.collection<Lock>(Collection.Messages);
		const { deletedCount } = await collection.deleteMany({ chatId });
		return deletedCount;
	} catch (e) {
		logger.error(e);
		return 0;
	}
};

export const saveMessages: StoredMessagesSaver = async (
	messages: DbMessage[],
) => {
	try {
		client ||= new MongoClient(dbConnectionString);
		const database = client.db(dbName);
		const collection = database.collection<DbMessage>(Collection.Messages);
		await collection.insertMany(messages);
	} catch (e) {
		logger.error(e);
	}
};

export const unlockChat: ChatUnlocker = async (chatId) => {
	if (!chatId) return;
	client ||= new MongoClient(dbConnectionString);
	const database = client.db(dbName);
	const collection = database.collection<Lock>(Collection.Locks);
	await collection.deleteOne({ chatId });
};
