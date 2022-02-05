import { v4 } from "uuid";
import type { InProgressAssessment } from "./types";

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
