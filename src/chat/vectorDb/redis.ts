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
	await redisClient.disconnect();
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
