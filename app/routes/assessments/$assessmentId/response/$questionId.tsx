import invariant from "invariant";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  RouteComponent,
  useActionData,
  useLoaderData,
} from "remix";
import { Container, Main, MultiInput } from "~/components";
import { api as assessmentApi } from "~/modules/assessment/infra/";
import { api, api as collegeApi } from "~/modules/college/infra";
import { badRequest } from "~/util";
import { Params } from "react-router";

type LoaderData = {
  prompt: string;
  allowMultiple: boolean;
  attribute_values: string[];
  questionId: string;
};

async function getCurrentQuestion(params: {
  routeParams: Params<string>;
  questions: assessmentApi.QuestionDTO[];
}): Promise<assessmentApi.QuestionDTO> {
  invariant(params.routeParams.questionId, "expected params.questionId");
  const question = params.questions.find(
    (q) => q.id === params.routeParams.questionId
  );
  invariant(question, "expected question");
  return question;
}

async function getNextQuestion(params: {
  routeParams: Params<string>;
  questions: assessmentApi.QuestionDTO[];
}): Promise<assessmentApi.QuestionDTO> {
  invariant(params.routeParams.questionId, "expected params.questionId");
  const index = params.questions.findIndex(
    (question) => question.id === params.routeParams.questionId
  );
  return params.questions[index + 1];
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const questions = await assessmentApi.getQuestions();
  const question = await getCurrentQuestion({ questions, routeParams: params });
  const attributeValues = await collegeApi.getAttributeValuesForQuestion(
    question.id
  );
  return {
    prompt: question.prompt,
    allowMultiple: question.is_boolean,
    attribute_values: attributeValues
      .map((attributeValue) => attributeValue.value)
      .concat(question.skip_value)
      .filter(Boolean),
    questionId: question.id,
  };
};

type ActionData = {
  formError?: string;
  fields?: {
    email?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<Response> => {
  const assessmentId = params.assessmentId;
  invariant(assessmentId, "expected params.assessmentId");
  const questionId = params.questionId;
  invariant(questionId, "expected params.questionId");

  const formData = await request.formData();
  const responses = formData.getAll(questionId) as string[];

  if (responses.length === 0) {
    return badRequest<ActionData>({
      formError: "Must select a response.",
    });
  }

  await assessmentApi.addAssessmentResponse({
    assessmentId,
    questionId,
    skipped: false,
    responses,
  });

  const questions = await assessmentApi.getQuestions();
  const nextQuestion = await getNextQuestion({
    questions,
    routeParams: params,
  });

  if (nextQuestion) {
    return redirect(`/assessments/${assessmentId}/response/${nextQuestion.id}`);
  }

  await assessmentApi.completeAssessment(assessmentId);
  return redirect(`/assessments/${assessmentId}/complete`);
};

const routeComponent: RouteComponent = () => {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  return (
    <Container>
      <Main>
        <Form method="post">
          <MultiInput
            name={loaderData?.questionId}
            type={loaderData?.allowMultiple ? "radio" : "checkbox"}
            label={loaderData.prompt}
            error={actionData?.formError}
            options={loaderData.attribute_values.map((value) => ({
              label: value,
              value: value,
            }))}
          />
          <button type="submit">Next</button>
        </Form>
      </Main>
    </Container>
  );
};

export default routeComponent;
