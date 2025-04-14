import { RedisVectorStore } from '@langchain/redis';
import {
	vectordbConnectionString as url,
	vectorDbIndex as indexName,
} from '@utils/env';
import { createClient } from 'redis';
import type { VectorDb } from '../interfaces';
import embeddings from './embeddings';

const redisClient = createClient({ url });

export const closeVectorDb: VectorDb['closeVectorDb'] = async () => {
	try {
		await redisClient.disconnect();
	} catch (e) {
		const redisError = e as Error;
		if (redisError?.message === 'The client is closed') return; // Already closed, do nothing.
		throw e;
	}
};

export const initVectorDb: VectorDb['initVectorDb'] = async () => {
	await redisClient.connect();
};

export const vectorStore: VectorDb['vectorStore'] = new RedisVectorStore(
	embeddings,
	{
		redisClient: redisClient,
		indexName,
	},
);
