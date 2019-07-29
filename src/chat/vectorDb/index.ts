import { type VectorDb, VectorDbType } from '@chat/interfaces';
import { vectorDbType } from '@utils/env';
import * as redis from './redis';

let vectorDb: VectorDb;

switch (vectorDbType) {
	// biome-ignore lint/complexity/noUselessSwitchCase: demo code
	case VectorDbType.Redis:
	default: {
		const { closeVectorDb, initVectorDb, vectorStore } = redis;
		vectorDb = { closeVectorDb, initVectorDb, vectorStore };
		break;
	}
}

const { closeVectorDb, initVectorDb, vectorStore } = vectorDb;

export { closeVectorDb, initVectorDb, vectorStore };

export default vectorDb;
