import { LoaderFunction, redirect, RouteComponent, useLoaderData } from "remix";
import type { Session, MetaFunction } from "remix";
import { getSession } from "~/sessions";
import { GetUser } from "~/modules/user";
import getDbClient from "~/infra/getDbClient";
import UserRepo from "~/infra/UserRepo";

type UserData = {
  name: string;
};

export const meta: MetaFunction = () => {
  return { title: "College Finder" };
};

function redirectIfSessionDoesNotExist(session: Session) {
  if (!session.has("userId")) {
    return redirect("/login");
  }
}

function getUser(userId: string) {
  const userRepo = UserRepo(getDbClient());
  return GetUser(userRepo)(userId);
}

async function returnUserData(session: Session): Promise<UserData> {
  const userId = session.get("userId");
  const user = await getUser(userId);
  return { name: user.firstName };
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirectIfSessionDoesNotExist(session) || returnUserData(session);
};

const routeComponent: RouteComponent = () => {
  const userData = useLoaderData<UserData>();
  return (
    <div>
      <nav>
        <ul>
          <li>
            <form action="/logout" method="post">
              <button type="submit" className="button">
                Logout
              </button>
            </form>
          </li>
        </ul>
      </nav>
      <div>Welcome to College Finder, {userData.name}!</div>
    </div>
  );
};

export default routeComponent;
