import invariant from "invariant";
import { LoaderFunction, redirect } from "remix";
import { api } from "~/modules/assessment/infra";

export const loader: LoaderFunction = async ({ params }): Promise<any> => {
  invariant(params.assessmentId, "expected params.assessmentId");

  const assessment = await api.getAssessment(params.assessmentId);
  if (assessment.completeDate) {
    return redirect(`/assessments/${params.assessmentId}/results`);
  }

  const questions = await api.getQuestions();
  const [firstQuestion] = questions;
  return redirect(
    `/assessments/${params.assessmentId}/response/${firstQuestion.id}`
  );
};

export default () => {};
