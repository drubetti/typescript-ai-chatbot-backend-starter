import type { Document, DocumentInterface } from '@langchain/core/documents';
import { trimMessages } from '@langchain/core/messages';
import {
	Annotation,
	END,
	MessagesAnnotation,
	START,
	StateGraph,
} from '@langchain/langgraph';
import { dbHistoryLimit } from '@utils/env';
import { logger } from '@utils/logger';
import { vectorStore } from '../vectorDb';
import checkpointer from './checkpointer';
import llm from './llm';
import promptTemplate from './prompt';

const StateAnnotation = Annotation.Root({
	...MessagesAnnotation.spec,
	context: Annotation<Document[]>,
	language: Annotation<string>(),
});

const trimmer = trimMessages({
	maxTokens: dbHistoryLimit,
	strategy: 'last',
	tokenCounter: ({ length }) => length,
	includeSystem: true,
	allowPartial: false,
	startOn: 'human',
});

const retrieve = async (state: typeof StateAnnotation.State) => {
	const { messages = [] } = state;
	const lastHumanMessage = [...messages]
		.reverse()
		.find((m) => m.getType() === 'human');
	const question = lastHumanMessage?.content;

	let retrievedDocs: DocumentInterface[];

	try {
		retrievedDocs = question
			? await vectorStore.similaritySearch(`${question}`)
			: [];
	} catch (e) {
		logger.error(e);
		logger.info('Retrieval failed, using empty context.');
		retrievedDocs = [];
	}

	return { context: retrievedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
	const docsContent = state.context.map((doc) => doc.pageContent).join('\n');
	const messages = await trimmer.invoke(state.messages);

	const prompt = await promptTemplate.invoke({
		...state,
		context: docsContent,
		messages,
	});
	const response = await llm.invoke(prompt);

	return { messages: [response] };
};

const workflow = new StateGraph(StateAnnotation)
	.addNode('retrieve', retrieve)
	.addNode('generate', generate)
	.addEdge(START, 'retrieve')
	.addEdge('retrieve', 'generate')
	.addEdge('generate', END);

export const graph = workflow.compile({ checkpointer });

export default graph;
