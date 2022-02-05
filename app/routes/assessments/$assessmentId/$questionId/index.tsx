import invariant from "invariant";
import { LoaderFunction, RouteComponent, useLoaderData } from "remix";
import { getQuestions } from "~/modules/assessment/infra/http";

type LoaderData = {
  prompt: string;
  skip_value: string;
  options: string[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  invariant(params.questionId, "expected params.questionId");
  const questions = await getQuestions();
  const question = questions.find((q) => q.id === params.questionId);
  invariant(question, "expected question");
  return {
    prompt: question.prompt,
    skip_value: question.skip_value,
    options: [],
  };
};

const routeComponent: RouteComponent = () => {
  const data = useLoaderData();
  return <div>{data.prompt}</div>;
};

export default routeComponent;
