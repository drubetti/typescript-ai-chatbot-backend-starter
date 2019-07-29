import { Joi, Segments } from 'celebrate';
import { ChatRouteParam } from '../interfaces';

export interface GetMessagesParamsSchema {
	[ChatRouteParam.GetMessages]: string;
}

export const getMessagesParamsSchema =
	Joi.object<GetMessagesParamsSchema>().keys({
		[ChatRouteParam.GetMessages]: Joi.string().uuid(),
	});

export default {
	[Segments.PARAMS]: getMessagesParamsSchema,
};
