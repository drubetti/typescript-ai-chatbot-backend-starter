import process from 'node:process';
import { EmbeddingService } from '@chat/interfaces/EmbeddingService';
import { LlmService } from '@chat/interfaces/LlmService';
import { config } from 'dotenv';

const { NODE_ENV } = process.env;
const path = `.env${NODE_ENV ? `.${NODE_ENV}` : ''}`;
const parsedEnv = config({ path });

const REQUIRED_LLM_API_KEY_SERVICES: Readonly<string[]> = [LlmService.OpenAI];
const REQUIRED_EMBEDDINGS_API_KEY_SERVICES: Readonly<string[]> = [
	LlmService.OpenAI,
];

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
	EMBEDDINGS_API_KEY: embeddingsApiKey = '',
	EMBEDDINGS_BASE_URL: embeddingsBaseUrl = 'http://localhost:11434',
	EMBEDDINGS_MODEL_NAME: embeddingsModel = 'mxbai-embed-large',
	EMBEDDINGS_MODEL_SERVICE: embeddingsService = 'ollama',
	LLM_API_KEY: llmApiKey = '',
	LLM_BASE_URL: llmBaseUrl = 'http://localhost:11434',
	LLM_NAME: llmName = 'llama3.2:1b',
	LLM_SERVICE: llmService = 'ollama',
	VECTOR_DB_CONNECTION_STRING:
		vectordbConnectionString = 'redis://localhost:6379',
	VECTOR_DB_INDEX: vectorDbIndex = 'documents',
	VECTOR_DB_TYPE: vectorDbType = 'redis',
} = process.env;

const isEmbeddingsApiKeyRequired =
	REQUIRED_EMBEDDINGS_API_KEY_SERVICES.includes(embeddingsService);
if (isEmbeddingsApiKeyRequired && !embeddingsApiKey)
	throw new Error(
		`The environment variable EMBEDDINGS_API_KEY is required if EMBEDDINGS_MODEL_SERVICE is "${llmService}"`,
	);

const isLlmApiKeyRequired = REQUIRED_LLM_API_KEY_SERVICES.includes(llmService);
if (isLlmApiKeyRequired && !llmApiKey)
	throw new Error(
		`The environment variable LLM_API_KEY is required if LLM_SERVICE is "${llmService}"`,
	);

switch (embeddingsService) {
	case EmbeddingService.OpenAI:
		// OpenAI requires this to be set in the process environment:
		process.env.OPENAI_API_KEY = embeddingsApiKey;
		// The value can be overwritten by the LLM key if the service is the same.
		break;
	default:
		// Do nothing otherwise.
		break;
}

switch (llmService) {
	case LlmService.OpenAI:
		// OpenAI requires this to be set in the process environment:
		process.env.OPENAI_API_KEY = llmApiKey;
		break;
	default:
		// Do nothing otherwise.
		break;
}

export const dbHistoryLimit = Number.parseInt(DB_HISTORY_LIMIT) || 20;
export const embeddingsChunkOverlap =
	Number.parseInt(EMBEDDINGS_SPLITTER_CHUNK_OVERLAP) || 200;
export const embeddingsChunkSize =
	Number.parseInt(EMBEDDINGS_SPLITTER_CHUNK_SIZE) || 1000;
export const llmTemperature = +LLM_TEMPERATURE || 0;

export default parsedEnv;
