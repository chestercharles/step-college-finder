import { Form, json, redirect, useActionData, useLoaderData } from "remix";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  RouteComponent,
  Session,
} from "remix";
import UserRepo from "~/infra/UserRepo";
import getDbClient from "~/infra/getDbClient";
import { AuthenticateUser } from "~/modules/user";
import { commitSession, getSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return { title: "Login" };
};

function redirectIfSessionExists(session: Session) {
  if (session.has("userId")) {
    return redirect("/college-finder");
  }
}

async function commitNewSession(session: Session) {
  return json(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirectIfSessionExists(session) || commitNewSession(session);
};

type ActionData = {
  formError?: string;
  fields?: {
    email?: string;
    password?: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return badRequest({ formError: "Must provide an email and password" });
  }

  const userRepo = UserRepo(getDbClient());
  const authenticateUser = AuthenticateUser(userRepo);
  const userId = await authenticateUser({ email, password });

  if (typeof userId !== "string") {
    return badRequest({ formError: "Invalid email/password combination" });
  }

  session.set("userId", userId);

  return redirect("/college-finder", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const routeComponent: RouteComponent = () => {
  const actionData = useActionData<ActionData>();
  return (
    <Form method="post">
      {actionData?.formError && <div>{actionData?.formError}</div>}
      <p>
        <label>
          Email: <input type="text" name="email" />
        </label>
      </p>
      <p>
        <label>
          Password: <input type="password" name="password" />
        </label>
      </p>
      <p>
        <button type="submit">Login</button>
      </p>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </Form>
  );
};

export default routeComponent;
