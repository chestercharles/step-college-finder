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
      const newResponse: AssessmentResponse = {
        id: v4(),
        skipped: payload.skipped,
        responseValues: payload.responseValues,
        questionId: payload.questionId,
      };
      return {
        ...assessment,
        responses: [...assessment.responses, newResponse],
      };
    }

    throw new Error("Assessment has already been completed");
  };
