import { useParams } from "react-router";
import { Container, Main } from "~/components";

export default function Complete() {
  const params = useParams();
  return (
    <Container>
      <Main>
        <h4>Assessment Complete</h4>
        <a href={`/assessments/${params.assessmentId}/results`}>View Results</a>
      </Main>
    </Container>
  );
}
