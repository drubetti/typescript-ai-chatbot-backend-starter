import type { VectorStore } from '@langchain/core/vectorstores';

export enum VectorDbType {
	Redis = 'redis',
}

export interface VectorDb {
	closeVectorDb: () => Promise<void>;
	initVectorDb: () => Promise<void>;
	vectorStore: VectorStore;
}
