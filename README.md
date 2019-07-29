# TypeScript AI Chatbot Backend Starter

An example AI chatbot backend project made with [TypeScript](https://www.typescriptlang.org/),
[LangChain](https://www.langchain.com/) and [Express](https://expressjs.com/).

### Requirements

- [Node.js](https://nodejs.org/) v22 _or_ [Node Version Manager](https://github.com/nvm-sh/nvm)
  - _To run the application._
- [Ollama](https://ollama.com/)
  - _As the LLM service._
- [Redis Stack](https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/) (**not** [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/)!)
  - _To save LLM embeddings._
- [MongoDB](https://www.mongodb.com/) _(optional)_
  - _To save the chat history._
- [Docker](https://www.docker.com/) _(optional)_
  - _To install the required services or run the application in a container._

### Environment variables

Create your `.env` file:

```shell
cp .env.sample .env
```

The supported environment variables are:

- `APP_SERVER_PORT`: the TCP port that the application will listen to for incoming HTTP requests (default: `3000`).
- `DB_CONNECTION_STRING`: the MongoDB connection string. Ignored if `DB_TYPE` is `memory`.
- `DB_HISTORY_LIMIT`: the number of past messages in the chat that the LLM will consider when giving answers. Higher the number, lower the performance.
- `DB_NAME`: the name of the database where the messages will be stored. Ignored if `DB_TYPE` is `memory`.
- `DB_TYPE`: can be `mongodb` or `memory`. If set to `memory` or an unsupported value, the messages will not be persisted.
- `EMBEDDINGS_BASE_URL`: the Ollama connection string (for embeddings).
- `EMBEDDINGS_MODEL_NAME`: the model that will be used for LLM embeddings.
- `LLM_BASE_URL`: the Ollama connection string.
- `LLM_NAME`: the name of the LLM.
- `LLM_TEMPERATURE`: the LLM temperature (default: `0`).
- `VECTOR_DB_CONNECTION_STRING`: the Redis Stack connection string.
- `VECTOR_DB_INDEX`: the LLM embeddings index name.
- `VECTOR_DB_TYPE`: the only supported value is `redis`. Ignored ATM.

### Setup

```shell
npm i
```

### Static Type Check

```shell
npm run type-check
```

### Lint and format code

```shell
npm run biome
```

### Run Tests

_The tests are just stubbed._

```shell
npm t
```

### Build JavaScript code

```shell
npm run build
```

Built code will be put in `dist` folder.

### Start the required services

You can install and start Redis Stack using Docker:

```shell
docker compose -f docker-compose.redis.yml up -d
```

You are supposed to already have a working Ollama service.  
A local Ollama instance can be installed [natively](https://github.com/ollama/ollama/blob/main/README.md)
or [with Docker](https://hub.docker.com/r/ollama/ollama).  
The models set in `EMBEDDINGS_MODEL_NAME` and `LLM_NAME` must be pulled before starting the app.

```shell
ollama pull llama3.2:1b
ollama pull mxbai-embed-large
```

Replace `llama3.2:1b` and `mxbai-embed-large` with the models you have set in your `.env` file.  
If using a remote Ollama service, the models can also be pulled by making a `POST` request to the service:

```shell
curl http://localhost:11434/api/pull -d '{
  "model": "llama3.2:1b"
}'
```

```shell
curl http://localhost:11434/api/pull -d '{
  "model": "mxbai-embed-large"
}'
```

Replace `http://localhost:11434` with your service's URL and the `model` values with the ones you need.  
Read more [here](https://github.com/ollama/ollama/blob/main/docs/api.md#pull-a-model).

### Start App (on-the-fly compilation, for development)

```shell
npm start
```

### Start App (AOT compilation, for production)

Build JavaScript code, then run:

```shell
node dist
```

### Start App in Docker (on-the-fly compilation, for development)

Build the Docker image:

```shell
npm run docker-build-dev
```

Once the image is built, run:

```shell
npm run docker-start-dev
```

or (for "watch" mode):

```shell
npm run docker-watch
```

The Docker image can be reused on code changes (the repository is mounted as a volume).

### Start App in Docker (AOT compilation, for production)

Build the Docker image:

```shell
npm run docker-build
```

Once the image is built, run:

```shell
npm run docker-start
```

The Docker image must be rebuilt on any code change!

### Embedding documents

If you wish to embed documents to give a specific context to the AI,
you must send an HTTP POST request to the `/documents/load` endpoint with a JSON body such as:

```json
{
  "url": "http://localhost:3000/public/example.html"
}
```

where the `url` value is the URI of the HTML document you wish to embed.

```shell
curl --location 'http://localhost:3000/documents/load' \
--header 'Content-Type: application/json' \
--data '{
    "url": "http://localhost:3000/public/example.html"
}'
```

An example document is provided in [public/example.html](public/example.html) and is served by the app.  
Replace the example document content with your own or create another one.

If you don't embed anything, the AI will answer with just its basic knowledge.

### Setting the initial prompt message.

Customize the initial prompt message in [src/chat/ai/prompt.ts](src/chat/ai/prompt.ts).

### Using the app

After starting the app, send a `POST` request to the `/chat` endpoint with a `body` such as:

```json
{
  "chatId": "some-uuid",
  "message": "<your message to the AI here>"
}
```

The `chatId` must be a UUID and remain the same for the chat session.
If it changes, the AI will interpret the message as belonging to a new chat session.

Example:

```shell
curl --location 'http://localhost:3000/chat' \
--header 'Content-Type: application/json' \
--data '{
    "chatId": "59011882-bbac-4b34-b18a-4ccab851caf6",
    "message": "Hello!"
}'
```

The app will send a plaintext response such as:

```text
Hello! I'm here to help you with any issues. What seems to be the problem or question you have?
```

The response will be streamed.  
You can then send another message, just remember to use the same `chatId` for the chat session.  
If not, the AI will not remember any previous message.  
You cannot send a new message to a chat if the application is sending answer to that chat.

### Message history

You can retrieve the messages of a chat by sending a `GET` request to the `/chat` endpoint,
using the `chatId` as a path parameter:

```shell
curl --location 'http://localhost:3000/chat/59011882-bbac-4b34-b18a-4ccab851caf6'
```

The messages can be deleted with a `DELETE` request to the same URL:

```shell
curl --location --request DELETE 'http://localhost:3000/chat/59011882-bbac-4b34-b18a-4ccab851caf6'
```

### API documentation

Swagger API documentation will be served at the `/swagger` endpoint.  
Just open http://localhost:3000/swagger with your browser after starting the application.

Read more [here](https://github.com/Surnet/swagger-jsdoc) and [here](https://github.com/scottie1984/swagger-ui-express).

### Stop app

```shell
Ctrl^C
```

To stop and clear Redis Stack database (embeddings will be deleted), if it was started with Docker, run:

```shell
docker compose -f docker-compose.redis.yml down
```
