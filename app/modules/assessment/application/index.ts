import {
  startAssessment,
  addResponseToAssessment,
  completeAssessment,
} from "../domain";
import type { Assessment, Question } from "../domain";

export type IAssessmentRepo = {
  add: (assessment: Assessment) => Promise<Assessment>;
  update: (assessment: Assessment) => Promise<Assessment>;
  find: (params: { id?: string; userId?: string }) => Promise<Assessment[]>;
};

export type IQuestionRepo = {
  find: () => Promise<Question[]>;
};

type StartAssessmentHandler = (
  assessmentRepo: IAssessmentRepo
) => (user_id: string) => Promise<Assessment>;
export const StartAssessmentHandler: StartAssessmentHandler =
  (assessmentRepo) => async (user_id) => {
    const assessment = startAssessment(user_id);
    await assessmentRepo.add(assessment);
    return assessment;
  };

type CompleteAssessmentHandler = (
  assessmentRepo: IAssessmentRepo
) => (assessmentId: string) => Promise<Assessment>;
export const CompleteAssessmentHandler: CompleteAssessmentHandler =
  (assessmentRepo) => async (assessmentId) => {
    const [assessment] = await assessmentRepo.find({ id: assessmentId });
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    const completedAssessment = completeAssessment(assessment);
    await assessmentRepo.update(completedAssessment);
    return assessment;
  };

type AddAssessmentResponseHandler = (
  assessmentRepo: IAssessmentRepo
) => (payload: {
  assessmentId: string;
  questionId: string;
  skipped: boolean;
  responseValues: string[];
}) => Promise<void>;
export const AddAssessmentResponseHandler: AddAssessmentResponseHandler =
  (assessmentRepo) =>
  async ({ assessmentId, ...payload }) => {
    let [assessment] = await assessmentRepo.find({ id: assessmentId });
    if (!assessment) throw new Error("Assessment not found");
    assessment = addResponseToAssessment(assessment)(payload);
    await assessmentRepo.update(assessment);
  };

type GetAssessmentQuery = (
  assessmentRepo: IAssessmentRepo
) => (assessmentId: string) => Promise<Assessment>;
export const GetAssessmentQuery: GetAssessmentQuery =
  (assessmentRepo) => async (assessmentId) => {
    const [assessment] = await assessmentRepo.find({ id: assessmentId });
    if (!assessment) throw new Error("Assessment not found");
    return assessment;
  };

type GetUserAssessmentQuery = (
  assessmentRepo: IAssessmentRepo
) => (userId: string) => Promise<Assessment[]>;
export const GetUserAssessmentQuery: GetUserAssessmentQuery =
  (assessmentRepo) => async (userId) => {
    const assessments = await assessmentRepo.find({ userId });
    return assessments;
  };

type GetQuestionsQuery = (
  questionRepo: IQuestionRepo
) => () => Promise<Question[]>;
export const GetQuestionsQuery: GetQuestionsQuery =
  (questionRepo) => async () => {
    const questions = await questionRepo.find();
    return questions;
  };
