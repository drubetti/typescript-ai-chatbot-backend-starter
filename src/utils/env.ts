import process from 'node:process';
import { config } from 'dotenv';

const { NODE_ENV } = process.env;
const path = `.env${NODE_ENV ? `.${NODE_ENV}` : ''}`;
const parsedEnv = config({ path });

const {
	DB_HISTORY_LIMIT = '',
	EMBEDDINGS_SPLITTER_CHUNK_OVERLAP = '',
	EMBEDDINGS_SPLITTER_CHUNK_SIZE = '',
	LLM_TEMPERATURE = '',
} = process.env;

export const {
	APP_SERVER_PORT: serverPort = '3000',
	DB_CONNECTION_STRING: dbConnectionString = '',
	DB_NAME: dbName = '',
	DB_TYPE: dbType = 'memory',
	EMBEDDINGS_BASE_URL: embeddingsBaseUrl = 'http://localhost:11434',
	EMBEDDINGS_MODEL_NAME: embeddingsModel = 'mxbai-embed-large',
	LLM_BASE_URL: llmBaseUrl = 'http://localhost:11434',
	LLM_NAME: llmName = 'llama3.2:1b',
	VECTOR_DB_CONNECTION_STRING:
		vectordbConnectionString = 'redis://localhost:6379',
	VECTOR_DB_INDEX: vectorDbIndex = 'documents',
	VECTOR_DB_TYPE: vectorDbType = 'redis',
} = process.env;

export const dbHistoryLimit = Number.parseInt(DB_HISTORY_LIMIT) || 20;
export const embeddingsChunkOverlap =
	Number.parseInt(EMBEDDINGS_SPLITTER_CHUNK_OVERLAP) || 200;
export const embeddingsChunkSize =
	Number.parseInt(EMBEDDINGS_SPLITTER_CHUNK_SIZE) || 1000;
export const llmTemperature = +LLM_TEMPERATURE || 0;

export default parsedEnv;
