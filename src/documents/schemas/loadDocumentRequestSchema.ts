import { Joi, Segments } from 'celebrate';
import type { SelectorType } from 'cheerio';

export interface LoadDocumentBodySchema {
	tagSelector?: SelectorType;
	url: string;
}

export const loadDocumentBodySchema = Joi.object<LoadDocumentBodySchema>().keys(
	{
		tagSelector: Joi.string().optional(),
		url: Joi.string().uri(),
	},
);

export default {
	[Segments.BODY]: loadDocumentBodySchema,
};
