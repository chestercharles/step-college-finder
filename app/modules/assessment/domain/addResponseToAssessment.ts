import { v4 } from "uuid";
import type {
  Assessment,
  InProgressAssessment,
  AssessmentResponse,
} from "./types";

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
  questionId: string;
}) => InProgressAssessment;

export const addResponseToAssessment: addResponseToAssessment =
  (assessment) => (payload) => {
    if (assessmentInProgress(assessment)) {
      const existingResponse = assessment.responses.find(
        (response) => response.questionId === payload.questionId
      );
      const newResponse: AssessmentResponse = {
        id: existingResponse?.id ?? v4(),
        skipped: payload.skipped,
        responseValues: payload.responseValues,
        questionId: payload.questionId,
      };
      return {
        ...assessment,
        responses: [
          ...assessment.responses.filter(
            (response) => response.id !== newResponse.id
          ),
          newResponse,
        ],
      };
    }

    throw new Error("Assessment has already been completed");
  };
