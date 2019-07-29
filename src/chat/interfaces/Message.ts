export enum MessageRole {
	Assistant = 'assistant',
	User = 'user',
}

export interface Message {
	role: MessageRole;
	content: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       description: "A message object."
 *       type: object
 *       properties:
 *         chatId:
 *           type: string
 *           format: uuid
 *           required: true
 *         date:
 *           type: string
 *           format: date-time
 *           required: true
 *         message:
 *           type: string
 *           required: true
 *         role:
 *           type: string
 *           enum: [assistant, user]
 *           required: true
 */
export interface DbMessage extends Message {
	chatId: string;
	date: Date;
}
