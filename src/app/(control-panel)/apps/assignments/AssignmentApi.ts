import { LearningStage, LearningType } from '@shared/enums/Assignment';
import { amplifyApiService as api } from 'src/store/amplifyApiService';

export const addTagTypes = ['assessment_assignment_list'] as const;

const AssessmentApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAssignments: build.query({
				query: () => ({ modelName: 'Assignment', operation: 'list' }),
				providesTags: ['assessment_assignment_list']
			})
		}),
		overrideExisting: false
	});

export { AssessmentApi };

export const { useGetAssignmentsQuery } = AssessmentApi;

export type Assignment = {
  id:string;
	title: string;
	content: string;
	ageRange: {
		lower: number;
		upper: number;
	};
	workSet?: string;
	learningType: LearningType;
	learningStage: LearningStage;
	scaffolding: {
		chunks: boolean;
		guidance: boolean;
		visualAids: boolean;
	};
};

export type AssessmentApiType = {
	[AssessmentApi.reducerPath]: ReturnType<typeof AssessmentApi.reducer>;
};
