import type { Assessment, CompletedAssessment } from "./types";

type completeAssessment = (assessment: Assessment) => CompletedAssessment;
export const completeAssessment: completeAssessment = (assessment) => {
  if (assessment.completeDate) {
    throw new Error("Assessment already completed");
  }

  return {
    ...assessment,
    completeDate: new Date(),
  };
};
