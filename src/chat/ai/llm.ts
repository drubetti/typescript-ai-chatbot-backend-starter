import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import {
	llmBaseUrl as baseUrl,
	llmName as model,
	llmService as service,
	llmTemperature as temperature,
} from '@utils/env';
import { LlmService } from '../interfaces';

export let llm: ChatOllama | ChatOpenAI;

switch (service) {
	case LlmService.OpenAI:
		llm = new ChatOpenAI({
			model,
			temperature,
		});
		break;
	// biome-ignore lint/complexity/noUselessSwitchCase: demo code
	case LlmService.Ollama:
	default:
		llm = new ChatOllama({
			baseUrl,
			model,
			temperature,
		});
		break;
}

export default llm;
