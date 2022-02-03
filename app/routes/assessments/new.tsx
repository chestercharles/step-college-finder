import { Form, redirect, RouteComponent } from "remix";
import type { ActionFunction } from "remix";
import { destroySession, getSession } from "~/sessions";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  return redirect("/assessments/12");
};

const routeComponent: RouteComponent = () => {
  return (
    <div className="flex">
      <h4>Start a new Assessment</h4>
      <Form method="post">
        <button type="submit">Start</button>
      </Form>
    </div>
  );
};

export default routeComponent;
