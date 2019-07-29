export const jsDocDonfig = {
	definition: {
		components: {
			securitySchemes: {},
		},
		openapi: '3.0.0',
		info: {
			title: 'Chatbot API',
			version: '1.0.0',
		},
		security: [],
	},
	apis: [
		...[
			// Order matters!
			'utils/serverErrors.ts',
			'utils/noContent.ts',
			'version/routes/routes.ts',
			'documents/routes/routes.ts',
			'chat/interfaces/*.ts',
			'chat/schemas/*.ts',
			'chat/routes/routes.ts',
		].map((path) => `./src/${path}`),
	],
};

export default jsDocDonfig;
