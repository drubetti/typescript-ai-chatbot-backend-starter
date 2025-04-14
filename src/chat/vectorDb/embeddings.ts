import { OllamaEmbeddings } from '@langchain/ollama';
import { OpenAIEmbeddings } from '@langchain/openai';
import {
	embeddingsBaseUrl as baseUrl,
	embeddingsModel as model,
	embeddingsService as service,
} from '@utils/env';
import { EmbeddingService } from '../interfaces';

export let embeddings: OllamaEmbeddings | OpenAIEmbeddings;

switch (service) {
	case EmbeddingService.OpenAI:
		embeddings = new OpenAIEmbeddings({ model });
		break;
	// biome-ignore lint/complexity/noUselessSwitchCase: demo code
	case EmbeddingService.Ollama:
	default:
		embeddings = new OllamaEmbeddings({ baseUrl, model });
		break;
}

export default embeddings;
