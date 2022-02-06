import { LoaderFunction, redirect } from "remix";
import {
  getSessionFromRequest,
  isNotLoggedIn,
  redirectToLogin,
} from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromRequest(request);
  if (isNotLoggedIn(session)) {
    return redirectToLogin(session);
  }
  return redirect("/assessments");
};

export default () => {};
