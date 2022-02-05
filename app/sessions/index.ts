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

export { commitSession };

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export function isNotLoggedIn(session: Session) {
  return !session.get("userId");
}

export async function getSessionFromRequest(request: Request) {
  return await getSession(request.headers.get("Cookie"));
}

export async function redirectToLogin(session: Session) {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export function redirectToApp() {
  return redirect("/assessments");
}
