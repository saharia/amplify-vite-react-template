import { createApi } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

type AmplifyClientBaseQueryArgs = {
	operation: 'list' | 'create' | 'update' | 'delete';
	modelName: keyof typeof client.models; // 'Assignment', 'Student', etc.
	data?: any; // For create/update
	id?: string; // For update/delete
	queryOptions?: object; // Extra options like sorting, filtering
};
const client = generateClient<Schema>();

const amplifyClientBaseQuery: BaseQueryFn<
	AmplifyClientBaseQueryArgs,
	unknown,
	FetchBaseQueryError,
	object,
	FetchBaseQueryMeta
> = async (args) => {
	const { modelName, operation, data, id, queryOptions } = args;

	try {
		const model = client.models[modelName];

		if (!model) throw new Error(`Model ${String(modelName)} not found in Amplify client.`);

		let result;

		switch (operation) {
			case 'list': {
				const listResult = await model.list(queryOptions);
				result = listResult.data;
				break;
			}
			case 'create': {
				result = await model.create(data);
				break;
			}
			case 'update': {
				if (!id) throw new Error('ID is required for update operation.');

				result = await model.update({ id, ...data });
				break;
			}
			case 'delete': {
				if (!id) throw new Error('ID is required for delete operation.');

				result = await model.delete({ id });
				break;
			}
			default:
				throw new Error(`Unsupported operation: ${operation}`);
		}

		return { data: result };
		// return result;
	} catch (error) {
		return { error: { status: 'CUSTOM_ERROR', data: (error instanceof Error ? error.message : 'An error occurred') } as FetchBaseQueryError };
	}
};

export const amplifyApiService = createApi({
	baseQuery: amplifyClientBaseQuery,
	endpoints: () => ({}),
	reducerPath: 'amplifyApiService'
});

export default amplifyApiService;
