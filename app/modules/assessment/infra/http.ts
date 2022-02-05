import {
  StartAssessmentHandler,
  GetAssessmentQuery,
  GetQuestionsQuery,
} from "~/modules/assessment/application";
import { Assessment, Question } from "~/modules/assessment/domain";
import { AssessmentRepo, QuestionRepo } from "~/modules/assessment/infra/repos";

type startAssessment = (userId: string) => Promise<{ assessmentId: string }>;
export const startAssessment: startAssessment = async (userId) => {
  const assessmentRepo = AssessmentRepo();
  const assessment = await StartAssessmentHandler(assessmentRepo)(userId);
  return { assessmentId: assessment.id };
};

type getAssessment = (assessmentId: string) => Promise<Assessment>;
export const getAssessment: getAssessment = async (userId) => {
  const assessmentRepo = AssessmentRepo();
  const assessment = await GetAssessmentQuery(assessmentRepo)(userId);
  return assessment;
};

type getQuestions = () => Promise<Question[]>;
export const getQuestions: getQuestions = async () => {
  const questionRepo = QuestionRepo();
  const questions = await GetQuestionsQuery(questionRepo)();
  return questions;
};
