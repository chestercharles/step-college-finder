import {
  StartAssessmentHandler,
  GetAssessmentQuery,
  GetQuestionsQuery,
  GetUserAssessmentQuery,
  AddAssessmentResponseHandler,
  CompleteAssessmentHandler,
} from "~/modules/assessment/application";
import { Assessment } from "~/modules/assessment/domain";
import { AssessmentRepo, QuestionRepo } from "~/modules/assessment/infra/repos";

export namespace api {
  type startAssessment = (userId: string) => Promise<{ assessmentId: string }>;
  export const startAssessment: startAssessment = async (userId) => {
    const assessmentRepo = AssessmentRepo();
    const assessment = await StartAssessmentHandler(assessmentRepo)(userId);
    return { assessmentId: assessment.id };
  };

  type completeAssessment = (
    assessmentId: string
  ) => Promise<{ assessmentId: string }>;
  export const completeAssessment: completeAssessment = async (
    assessmentId
  ) => {
    const assessmentRepo = AssessmentRepo();
    const assessment = await CompleteAssessmentHandler(assessmentRepo)(
      assessmentId
    );
    return { assessmentId: assessment.id };
  };

  export type AssessmentDTO = {
    id: string;
    userId: string;
    startDate: Date;
    completeDate: Date | null;
    responses: AssessmentResponseDTO[];
  };

  export type AssessmentResponseDTO = {
    id: string;
    skipped: boolean;
    responseValues: string[];
    questionId: string;
  };

  type getAssessment = (assessmentId: string) => Promise<AssessmentDTO>;
  export const getAssessment: getAssessment = async (userId) => {
    const assessmentRepo = AssessmentRepo();
    const assessment = await GetAssessmentQuery(assessmentRepo)(userId);
    return assessment;
  };

  type getUserAssessments = (userId: string) => Promise<Assessment[]>;
  export const getUserAssessments: getUserAssessments = async (userId) => {
    const assessmentRepo = AssessmentRepo();
    const assessment = await GetUserAssessmentQuery(assessmentRepo)(userId);
    return assessment;
  };

  export type QuestionDTO = {
    id: string;
    prompt: string;
    skip_value: string;
    exclusive: boolean;
    is_boolean: boolean;
    match_value: string;
    exclude_value: string;
  };

  type getQuestions = () => Promise<QuestionDTO[]>;
  export const getQuestions: getQuestions = async () => {
    const questionRepo = QuestionRepo();
    const questions = await GetQuestionsQuery(questionRepo)();
    return questions;
  };

  export type AddResponseDTO = {
    assessmentId: string;
    questionId: string;
    skipped: boolean;
    responses: string[];
  };

  type addAssessmentResponse = (params: AddResponseDTO) => Promise<void>;
  export const addAssessmentResponse: addAssessmentResponse = async (
    params
  ) => {
    const assessmentRepo = AssessmentRepo();
    await AddAssessmentResponseHandler(assessmentRepo)({
      assessmentId: params.assessmentId,
      questionId: params.questionId,
      skipped: params.skipped,
      responseValues: params.responses,
    });
  };
}
