import { ChatOllama } from '@langchain/ollama';
import {
	llmBaseUrl as baseUrl,
	llmName as model,
	llmTemperature as temperature,
} from '@utils/env';

export const llm = new ChatOllama({
	baseUrl,
	model,
	temperature,
});

export default llm;
