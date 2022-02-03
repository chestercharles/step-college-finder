import type { LoaderFunction } from "remix";
import {
  getSession,
  redirectToAppIfLoggedIn,
  redirectToLoginIfLoggedOut,
} from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return (
    redirectToAppIfLoggedIn(session) || redirectToLoginIfLoggedOut(session)
  );
};

export default () => {};
