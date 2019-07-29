import { Joi, Segments } from 'celebrate';
import { ChatRouteParam } from '../interfaces';

export interface DeleteMessagesParamsSchema {
	[ChatRouteParam.DeleteMessages]: string;
}

export const deleteMessagesParamsSchema =
	Joi.object<DeleteMessagesParamsSchema>().keys({
		[ChatRouteParam.DeleteMessages]: Joi.string().uuid(),
	});

export default {
	[Segments.PARAMS]: deleteMessagesParamsSchema,
};
