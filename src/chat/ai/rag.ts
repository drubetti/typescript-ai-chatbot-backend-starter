import { vectorStore } from '@chat/vectorDb';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import {
	embeddingsChunkOverlap as chunkOverlap,
	embeddingsChunkSize as chunkSize,
} from '@utils/env';
import type { SelectorType } from 'cheerio';

export const loadDocumentsFromUrl = async (
	url: string,
	tagSelector: SelectorType = 'p',
) => {
	const cheerioLoader = new CheerioWebBaseLoader(url, {
		selector: tagSelector,
	});

	const documents = await cheerioLoader.load();
	if (!documents[0]) throw new Error('RAG loading error: no document found');

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize,
		chunkOverlap,
	});
	const splitDocuments = await splitter.splitDocuments(documents);
	await vectorStore.addDocuments(splitDocuments);

	return documents.reduce(
		(acc, doc) => acc + (doc.pageContent?.length || 0),
		0,
	);
};
