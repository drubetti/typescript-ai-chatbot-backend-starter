import { dbType } from '@utils/env';
import { type Db, DbType } from '../interfaces';
import * as mockDb from './mock';
import * as mongo from './mongo';
import * as postgres from './postgres';

let db: Db;

switch (dbType) {
	case DbType.MongoDB: {
		const {
			closeDb,
			deleteMessages,
			getMessages,
			initDb,
			lockChat,
			removeStaleLocks,
			saveMessages,
			unlockChat,
		} = mongo;
		db = {
			closeDb,
			deleteMessages,
			getMessages,
			initDb,
			lockChat,
			removeStaleLocks,
			saveMessages,
			unlockChat,
		};
		break;
	}
	case DbType.PostgreSQL: {
		const {
			closeDb,
			deleteMessages,
			getMessages,
			initDb,
			lockChat,
			removeStaleLocks,
			saveMessages,
			unlockChat,
		} = postgres;
		db = {
			closeDb,
			deleteMessages,
			getMessages,
			initDb,
			lockChat,
			removeStaleLocks,
			saveMessages,
			unlockChat,
		};
		break;
	}
	default: {
		const {
			closeDb,
			deleteMessages,
			getMessages,
			initDb,
			lockChat,
			removeStaleLocks,
			saveMessages,
			unlockChat,
		} = mockDb;
		db = {
			closeDb,
			deleteMessages,
			getMessages,
			initDb,
			lockChat,
			removeStaleLocks,
			saveMessages,
			unlockChat,
		};
		break;
	}
}

const {
	closeDb,
	deleteMessages,
	getMessages,
	initDb,
	lockChat,
	removeStaleLocks,
	saveMessages,
	unlockChat,
} = db;

export {
	closeDb,
	deleteMessages,
	getMessages,
	initDb,
	lockChat,
	removeStaleLocks,
	saveMessages,
	unlockChat,
};

export default db;
