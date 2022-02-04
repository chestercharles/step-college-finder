import { v4 } from "uuid";

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
  attributeId: string;
};

type startAssessment = (userId: string) => InProgressAssessment;
export const startAssessment: startAssessment = (userId) => {
  const assessment: InProgressAssessment = {
    id: v4(),
    userId: userId,
    startDate: new Date(),
    completeDate: null,
    responses: [],
  };
  return assessment;
};

function assessmentInProgress(
  assessment: Assessment
): assessment is InProgressAssessment {
  return assessment.completeDate === null;
}

type addResponseToAssessment = (
  assessment: Assessment
) => (payload: {
  skipped: boolean;
  responseValues: string[];
  attributeId: string;
}) => InProgressAssessment;

export const addResponseToAssessment: addResponseToAssessment =
  (assessment) => (payload) => {
    if (assessmentInProgress(assessment)) {
      const newResponse: AssessmentResponse = {
        id: v4(),
        skipped: payload.skipped,
        responseValues: payload.responseValues,
        attributeId: payload.attributeId,
      };
      return {
        ...assessment,
        responses: [...assessment.responses, newResponse],
      };
    }

    throw new Error("Assessment has already been completed");
  };
