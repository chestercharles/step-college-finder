import { LoaderFunction, Outlet, RouteComponent } from "remix";
import type { MetaFunction } from "remix";
import {
  getSessionFromRequest,
  isNotLoggedIn,
  redirectToLogin,
} from "~/sessions";

export const meta: MetaFunction = () => {
  return { title: "Assessments" };
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromRequest(request);
  if (isNotLoggedIn(session)) {
    return redirectToLogin(session);
  }
  return null;
};

const routeComponent: RouteComponent = () => {
  return (
    <div className="container">
      <div className="content">
        <Outlet />
        <div className="logout-button">
          <form action="/logout" method="post">
            <button type="submit" className="button">
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default routeComponent;
