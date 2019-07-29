import type { AIMessageChunk } from '@langchain/core/messages';
import type { Messages } from '@langchain/langgraph';
import type { Message } from '../interfaces';
import { StreamEventType } from '../interfaces';
import { isNativeCheckpointer } from './checkpointer';
import graph from './graph';

const DEFAULT_LANG = 'English';

export async function* getAiResponseGenerator({
	chatId,
	language = DEFAULT_LANG,
	messages,
}: {
	chatId: string;
	language?: string;
	messages: Message[];
}) {
	const stream = graph.streamEvents(
		{
			language,
			messages: messages as Messages,
		},
		{
			configurable: {
				thread_id: isNativeCheckpointer ? chatId : undefined,
			},
			version: 'v2',
		},
	);

	for await (const { event, data } of stream) {
		switch (event) {
			case StreamEventType.OnChatStream: {
				const { chunk } = data as { chunk: AIMessageChunk };
				const { tool_call_chunks } = chunk;
				if (tool_call_chunks?.length) break;

				const { content = '' } = chunk;
				yield content.toString();
				break;
			}
			case StreamEventType.OnChatEnd: {
				// ...
				break;
			}
			default: {
				// Do nothing.
			}
		}
	}

	return '';
}
