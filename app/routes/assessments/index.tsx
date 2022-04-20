import { LoaderFunction, useLoaderData } from "remix";
import { getSessionFromRequest, logout, redirectToLogin } from "~/sessions";
import { GetUser } from "~/modules/user";
import getDbClient from "~/infra/getDbClient";
import UserRepo from "~/infra/UserRepo";
import { Container, StepBackground, Main } from "~/components";
import { Section } from "~/components/Section";
import { api } from "~/modules/assessment/infra";

type LoaderData = {
  name: string;
  assessments: { id: string; name: string }[];
};

function getUser(userId: string) {
  const userRepo = UserRepo(getDbClient());
  return GetUser(userRepo)(userId);
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const session = await getSessionFromRequest(request);
  const userId = session.get("userId");
  const user = await getUser(userId);
  if (!user) {
    await logout(request);
    return redirectToLogin(session);
  }

  const assessments = await api.getUserAssessments(userId);
  return {
    name: user.firstName,
    assessments: assessments.map((assessment) => {
      return {
        id: assessment.id,
        name: assessment.startDate.toLocaleString(),
      };
    }),
  };
};

function LogoutButton() {
  return (
    <div style={{ position: "absolute", bottom: 5, right: "50%" }}>
      <form action="/logout" method="post">
        <button
          style={{
            background: "none!important",
            border: "none",
            padding: "0!important",
            color: "#069",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          type="submit"
        >
          Logout
        </button>
      </form>
    </div>
  );
}

export default function Assessments() {
  const user = useLoaderData<LoaderData>();
  return (
    <StepBackground>
      <Container>
        <Main>
          <Section>
            <div className="jumbotron">
              <div className="container text-center">
                <h1 className="display-4">Hello, {user.name}!</h1>{" "}
                {user.assessments.length > 0 && (
                  <p className="lead">
                    <a href={"/assessments/view"}>Completed Assessments</a>
                  </p>
                )}
                <p className="lead">
                  <a
                    className="btn btn-primary btn-lg"
                    href={`/assessments/new`}
                    role="button"
                  >
                    Start New Assessment
                  </a>
                </p>
              </div>
            </div>
          </Section>
        </Main>
        <LogoutButton />
      </Container>
    </StepBackground>
  );
}
