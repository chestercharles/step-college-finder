import { Form, redirect, useActionData } from "remix";
import type { ActionFunction } from "remix";
import { getSessionFromRequest } from "~/sessions";
import { api } from "~/modules/assessment/infra";
import { Container, MultiInput } from "~/components";
import { badRequest } from "~/util";

type ActionData = {
  formError?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const focus = formData.get("response");

  if (typeof focus !== "string") {
    return badRequest<ActionData>({
      formError: "Must select a focus.",
    });
  }

  if (focus === "outOfState") {
    const session = await getSessionFromRequest(request);
    const userId = session.get("userId");
    const { assessmentId } = await api.startAssessment(userId);
    const [firstQuestion] = await api.getQuestions();
    return redirect(
      `/assessments/${assessmentId}/response/${firstQuestion.id}`
    );
  }

  return redirect("/assessments/complete");
};

export default function New() {
  const actionData = useActionData<ActionData>();
  return (
    <Container>
      <Form method="post">
        <MultiInput
          label="What is your focus?"
          type="radio"
          name="response"
          error={actionData?.formError}
          options={[
            { label: "Arizona Universities (In-state)", value: "instate" },
            {
              label: "Arizona Universities (Out-of-state)",
              value: "outOfState",
            },
          ]}
        />
        <button type="submit">Next</button>
      </Form>
    </Container>
  );
}
