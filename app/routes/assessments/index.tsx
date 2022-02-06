import { LoaderFunction, RouteComponent, useLoaderData } from "remix";
import { getSessionFromRequest } from "~/sessions";
import { GetUser } from "~/modules/user";
import getDbClient from "~/infra/getDbClient";
import UserRepo from "~/infra/UserRepo";

type UserData = {
  name: string;
};

function getUser(userId: string) {
  const userRepo = UserRepo(getDbClient());
  return GetUser(userRepo)(userId);
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<UserData> => {
  const session = await getSessionFromRequest(request);
  const userId = session.get("userId");
  const user = await getUser(userId);
  return { name: user.firstName };
};

const routeComponent: RouteComponent = () => {
  const user = useLoaderData<UserData>();
  return (
    <div>
      <h4>{user.name}'s Assessments</h4>
      <div>
        <a href="/assessments/new">Start New Assessment</a>
      </div>
    </div>
  );
};

export default routeComponent;
