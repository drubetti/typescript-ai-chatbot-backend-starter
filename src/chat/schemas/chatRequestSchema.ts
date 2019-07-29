import { Joi, Segments } from 'celebrate';

export interface ChatBodySchema {
	chatId: string;
	message: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatBodySchema:
 *       description: "The body for sending a message to a chat."
 *       type: object
 *       properties:
 *         chatId:
 *           type: string
 *           format: uuid
 *           required: true
 *         message:
 *           type: string
 *           required: true
 */
export const chatBodySchema = Joi.object<ChatBodySchema>().keys({
	chatId: Joi.string().uuid(),
	message: Joi.string(),
});

export default {
	[Segments.BODY]: chatBodySchema,
};
