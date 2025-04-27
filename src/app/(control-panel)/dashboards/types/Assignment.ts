import { LearningType, LearningStage } from '@shared/enums/Assignment';

/**
 * Assignment
 */
export type Assignment = {
  id: string;
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
