import { MemorySaver } from '@langchain/langgraph';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { dbConnectionString, dbName, dbType } from '@utils/env';
import { Collection, DbType } from '../interfaces';

let checkpointer: MemorySaver | PostgresSaver | undefined;
let isNativeCheckpointer: boolean;

switch (dbType) {
	case DbType.MongoDB:
		// The history is handled manually, as MongoDB is not supported.
		// Do not use a native checkpointer.
		checkpointer = undefined;
		isNativeCheckpointer = false;
		break;
	case DbType.PostgreSQL:
		checkpointer = PostgresSaver.fromConnString(
			`${dbConnectionString}/${dbName}`,
			{
				schema: Collection.Messages,
			},
		);
		isNativeCheckpointer = true;
		break;
	default:
		checkpointer = new MemorySaver();
		isNativeCheckpointer = true;
}

export { checkpointer, isNativeCheckpointer };
export default checkpointer;
