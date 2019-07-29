import { loadDocumentsFromUrl } from '@chat/ai';
import logger from '@utils/logger';
import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { LoadDocumentBodySchema } from '../schemas';

export default async (
	req: Request<ParamsDictionary, LoadDocumentBodySchema>,
	_res: Response,
	next: NextFunction,
) => {
	const { tagSelector, url } = req.body as LoadDocumentBodySchema;

	try {
		const charactersCount = await loadDocumentsFromUrl(url, tagSelector);
		logger.info(`RAG: loaded ${charactersCount} characters from ${url}`);
		next();
	} catch (e) {
		next(e);
	}
};
