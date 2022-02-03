import { createCookieSessionStorage, redirect } from "remix";
import type { Session } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "step-college-finder-session",
      secrets: [process.env.SESSION_SECRET || "dev-secret"],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });

export { getSession, commitSession, destroySession };

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export function redirectToLoginIfLoggedOut(session: Session) {
  if (!session.get("userId")) {
    return redirect("/login");
  }
}

export function redirectToAppIfLoggedIn(session: Session) {
  if (session.get("userId")) {
    return redirect("/college-finder");
  }
}
