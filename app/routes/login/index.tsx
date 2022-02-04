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
import { commitSession, getSession, redirectToAppIfLoggedIn } from "~/sessions";
import Input from "~/components/Input";

export const meta: MetaFunction = () => {
  return { title: "Login" };
};

async function commitNewSession(session: Session) {
  return json(
    { error: session.get("error") },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirectToAppIfLoggedIn(session) || commitNewSession(session);
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

  return redirect("/assessments", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const routeComponent: RouteComponent = () => {
  const actionData = useActionData<ActionData>();
  return (
    <div className="container">
      <div className="content">
        <h1>Login</h1>
        <Form method="post">
          {actionData?.formError && (
            <div className="input-error">{actionData?.formError}</div>
          )}
          <Input label="Email" name="email" type="email" />
          <Input label="Password" name="password" type="password" />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default routeComponent;
