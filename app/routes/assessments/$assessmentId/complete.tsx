import { useParams } from "react-router";

export default function Complete() {
  const params = useParams();
  return (
    <div>
      <main>
        <h4>Assessment Complete</h4>
        <a href={`/assessments/${params.assessmentId}/results`}>View Results</a>
      </main>
    </div>
  );
}
