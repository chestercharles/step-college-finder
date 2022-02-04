import { startAssessment, addResponseToAssessment } from "../domain";
import type { Assessment } from "../domain";

export type IAssessmentRepo = {
  add: (assessment: Assessment) => Promise<Assessment>;
  update: (assessment: Assessment) => Promise<Assessment>;
  find: (params: { id?: string }) => Promise<Assessment[]>;
};

type StartAssessmentHandler = (
  assessmentRepo: IAssessmentRepo
) => (user_id: string) => Promise<Assessment>;
const StartAssessmentHandler: StartAssessmentHandler =
  (assessmentRepo) => async (user_id) => {
    const assessment = startAssessment(user_id);
    await assessmentRepo.add(assessment);
    return assessment;
  };

type AddAssessmentResponseHandler = (
  assessmentRepo: IAssessmentRepo
) => (payload: {
  assessmentId: string;
  attributeId: string;
  skipped: boolean;
  responseValues: string[];
}) => Promise<void>;
const AddAssessmentResponseHandler: AddAssessmentResponseHandler =
  (assessmentRepo) =>
  async ({ assessmentId, ...payload }) => {
    const [assessment] = await assessmentRepo.find({ id: assessmentId });
    if (!assessment) throw new Error("Assessment not found");
    await assessmentRepo.update(addResponseToAssessment(assessment)(payload));
  };
