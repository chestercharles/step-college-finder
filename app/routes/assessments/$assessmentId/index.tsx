import invariant from "invariant";
import { LoaderFunction, redirect, RouteComponent } from "remix";
import { getAssessment, getQuestions } from "~/modules/assessment/infra/http";

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<any> => {
  invariant(params.assessmentId, "expected params.assessmentId");
  const assessment = await getAssessment(params.assessmentId);
  const questions = await getQuestions();
  const [firstQuestion] = questions;
  return redirect(`/assessments/${params.assessmentId}/${firstQuestion.id}`);
};

const routeComponent: RouteComponent = () => {
  return <div>In index</div>;
};

export default routeComponent;
