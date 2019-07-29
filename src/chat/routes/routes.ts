import { celebrate as validateRequest } from 'celebrate';
import { Router } from 'express';
import { ChatRouteParam } from '../interfaces';
import { chat, deleteMessages, getMessages } from '../middlewares';
import {
	chatRequestSchema,
	deleteMessagesRequestSchema,
	getMessagesRequestSchema,
} from '../schemas';

const router = Router();

/**
 * @openapi
 * /chat/{chatId}:
 *   delete:
 *     security: []
 *     tags:
 *       - Chat
 *     description: "Delete a chat's messages"
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The chat's id.
 *     responses:
 *       200:
 *         description: The number of the deleted messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 deleted:
 *                   type: number
 */
router.delete(
	`/:${ChatRouteParam.DeleteMessages}`,
	validateRequest(deleteMessagesRequestSchema),
	deleteMessages,
);

/**
 * @openapi
 * /chat/{chatId}:
 *   get:
 *     security: []
 *     tags:
 *       - Chat
 *     description: "Get a chat's messages"
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The chat's id.
 *     responses:
 *       200:
 *         description: The list of the messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get(
	`/:${ChatRouteParam.GetMessages}`,
	validateRequest(getMessagesRequestSchema),
	getMessages,
);

/**
 * @openapi
 * /chat:
 *   post:
 *     security: []
 *     tags:
 *       - Chat
 *     description: Send a message to a chat
 *     requestBody:
 *       description: "Chat ID and message"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatBodySchema'
 *     responses:
 *       200:
 *         description: The answer, as a streamed string.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.post('/', validateRequest(chatRequestSchema), chat);

export default router;
