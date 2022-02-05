import { Form, redirect, RouteComponent } from "remix";
import type { ActionFunction } from "remix";
import { getSessionFromRequest } from "~/sessions";
import { getQuestions, startAssessment } from "~/modules/assessment/infra/http";
import RadioInput from "~/components/RadioInput";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSessionFromRequest(request);
  const userId = session.get("userId");
  const { assessmentId } = await startAssessment(userId);
  const [firstQuestion] = await getQuestions();
  return redirect(`/assessments/${assessmentId}/${firstQuestion.id}`);
};

const routeComponent: RouteComponent = () => {
  return (
    <Form method="post">
      <div className="flex">
        <h4>What is your focus?</h4>
        <RadioInput
          label="Arizona Universities (In-state)"
          type="radio"
          name="fav_language"
          value="instate"
        />
        <RadioInput
          label="National Colleges and Universities (Out-of-State)"
          type="radio"
          name="fav_language"
          value="outofstate"
        />
        <button type="submit">Next</button>
      </div>
    </Form>
  );
};

export default routeComponent;
