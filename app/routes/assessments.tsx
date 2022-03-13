import { LoaderFunction, Outlet, RouteComponent } from "remix";
import type { MetaFunction } from "remix";
import {
  getSessionFromRequest,
  isNotLoggedIn,
  redirectToLogin,
} from "~/sessions";

export const meta: MetaFunction = () => {
  return { title: "My Assessments" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromRequest(request);
  if (isNotLoggedIn(session)) {
    return redirectToLogin(session);
  }
  return null;
};

const routeComponent: RouteComponent = () => {
  return <Outlet />;
};

export default routeComponent;
