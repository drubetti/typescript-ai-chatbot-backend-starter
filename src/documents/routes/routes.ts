import { noContent } from '@utils/index';
import { celebrate as validateRequest } from 'celebrate';
import { Router } from 'express';
import { loadDocument } from '../middlewares';
import { loadDocumentRequestSchema } from '../schemas';

const router = Router();

/**
 * @openapi
 * /documents/load:
 *   post:
 *     security: []
 *     tags:
 *       - Documents
 *     description: Load a document by URL
 *     requestBody:
 *         description: "URL and tag selector of the document"
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   required: true
 *                 tagSelector:
 *                   type: string
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
router.post(
	'/load',
	validateRequest(loadDocumentRequestSchema),
	loadDocument,
	noContent,
);

export default router;
