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
import { RegisterUser } from "~/modules/user";
import {
  commitSession,
  getSessionFromRequest,
  isNotLoggedIn,
  redirectToApp,
} from "~/sessions";
import Input from "~/components/Input";

export const meta: MetaFunction = () => {
  return { title: "Register" };
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

function validateName(name: unknown): string | undefined {
  if (typeof name !== "string" || !name.trim()) {
    return "Must be not be blank";
  }
}

function validateEmail(email: unknown): string | undefined {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    return "Email is not valid";
  }
}

function validatePassword(password: unknown): string | undefined {
  if (typeof password !== "string") {
    return "Password is not valid";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 128) {
    return "Password must be less than 128 characters";
  }

  if (password.indexOf(" ") >= 0) {
    return "Password cannot contain spaces";
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string | undefined;
    password?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
  };
  fields?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const session = await getSessionFromRequest(request);

  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const firstName = formData.get("first_name");
  const lastName = formData.get("last_name");
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    return badRequest({ formError: "Form not submitted correctly." });
  }

  const fields = { email, password, firstName, lastName };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
    firstName: validateName(firstName),
    lastName: validateName(lastName),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const userRepo = UserRepo(getDbClient());
  const registerUser = RegisterUser(userRepo);
  const userId = await registerUser({ email, password, firstName, lastName });

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
        <h1>Register</h1>
        <Form method="post">
          {actionData?.formError && (
            <div className="input-error">{actionData?.formError}</div>
          )}
          <Input
            label="First Name"
            name="first_name"
            error={actionData?.fieldErrors?.firstName}
          />
          <Input
            label="Last Name"
            name="last_name"
            error={actionData?.fieldErrors?.lastName}
          />
          <Input
            label="Email"
            name="email"
            error={actionData?.fieldErrors?.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            error={actionData?.fieldErrors?.password}
          />
          <button type="submit">Register</button>
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default routeComponent;
