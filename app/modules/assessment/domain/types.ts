export type Assessment = {
  id: string;
  userId: string;
  startDate: Date;
  completeDate: Date | null;
  responses: AssessmentResponse[];
};

export type InProgressAssessment = {
  id: string;
  userId: string;
  startDate: Date;
  completeDate: null;
  responses: AssessmentResponse[];
};

export type CompletedAssessment = {
  id: string;
  userId: string;
  startDate: Date;
  completeDate: Date;
  responses: AssessmentResponse[];
};

export type AssessmentResponse = {
  id: string;
  skipped: boolean;
  responseValues: string[];
  questionId: string;
};

export type Question = {
  id: string;
  prompt: string;
  skip_value: string;
  exclusive: boolean;
  is_boolean: boolean;
};
