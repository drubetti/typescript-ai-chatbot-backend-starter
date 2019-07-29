import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from '@langchain/core/prompts';

const SYSTEM_MESSAGE = [
	[
		'You are a helpful assistant.',
		'Answer all questions to the best of your ability in {language}.',
		'You can use the following pieces of retrieved context to answer the question.',
		'If the context is not relevant to the question, answer using your knowledge.',
	].join(' '),
	'Context: {context}',
].join('\n');

export const promptTemplate = ChatPromptTemplate.fromMessages([
	['system', SYSTEM_MESSAGE],
	new MessagesPlaceholder('messages'),
]);

export default promptTemplate;
