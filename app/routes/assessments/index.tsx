import { LoaderFunction, useLoaderData } from "remix";
import { getSessionFromRequest, logout, redirectToLogin } from "~/sessions";
import { GetUser } from "~/modules/user";
import getDbClient from "~/infra/getDbClient";
import UserRepo from "~/infra/UserRepo";
import { Button, Container, Li, Main, Ul } from "~/components";
import { api } from "~/modules/assessment/infra";
import { Section } from "~/components/Section";

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
    <form action="/logout" method="post">
      <Button type="submit">Logout</Button>
    </form>
  );
}

export default function Assessments() {
  const user = useLoaderData<LoaderData>();
  return (
    <Container>
      <Main>
        <Section>
          <h4>{user.name}'s Assessments</h4>
          <a href={`/assessments/new`}>Start New Assessment</a>
        </Section>
        <Section>
          <h5>Completed Assessments</h5>
          <Ul>
            {user.assessments.map(({ id, name }) => (
              <Li key={id}>
                <a href={`/assessments/${id}`}>{name}</a>
              </Li>
            ))}
          </Ul>
        </Section>
      </Main>
      <LogoutButton />
    </Container>
  );
}
