import { OllamaEmbeddings } from '@langchain/ollama';
import {
	embeddingsBaseUrl as baseUrl,
	embeddingsModel as model,
} from '@utils/env';

export const embeddings = new OllamaEmbeddings({ baseUrl, model });

export default embeddings;
