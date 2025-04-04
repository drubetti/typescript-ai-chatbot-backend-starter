import type { Request, Response } from 'express';

/**
 * @swagger
 * components:
 *   responses:
 *     NoContent:
 *       description: The request was acknowledged.
 */
export const noContent = async (_req: Request, res: Response) =>
	void res.sendStatus(204);

export default noContent;
