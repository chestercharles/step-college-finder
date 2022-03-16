import { Form, json, redirect, useActionData } from "remix";
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
import {
  commitSession,
  getSessionFromRequest,
  isNotLoggedIn,
  redirectToApp,
} from "~/sessions";
import { Input, Container } from "~/components";
import { badRequest } from "~/util";

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
  const session = await getSessionFromRequest(request);
  if (isNotLoggedIn(session)) {
    return commitNewSession(session);
  }
  return redirectToApp();
};

type ActionData = {
  formError?: string;
  fields?: {
    email?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSessionFromRequest(request);

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

export default function Login() {
  const actionData = useActionData<ActionData>();
  return (
    <Container>
      <h1>Login</h1>
      <Form method="post">
        <Input label="Email" name="email" type="email" placeholder="email" />
        <Input
          label="Password"
          name="password"
          type="password"
          error={actionData?.formError}
          placeholder="password"
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </Form>
    </Container>
  );
}
