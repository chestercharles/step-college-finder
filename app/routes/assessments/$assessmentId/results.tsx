import invariant from "invariant";
import { LoaderFunction, useLoaderData } from "remix";
import { api as scoringApi } from "~/modules/scoring/infra";
import { api as collegeApi } from "~/modules/college/infra";

type LoaderData = {
  results: { name: string; score: number; matches: string[] }[];
};

function buildViewModal(params: {
  scoredAssessment: scoringApi.ScoredAssessmentDTO;
  colleges: collegeApi.CollegeDTO[];
}) {
  return params.colleges
    .map((college) => {
      const scoredCollege = params.scoredAssessment.scoredColleges.find(
        (scoredCollege) => scoredCollege.collegeId === college.id
      );
      invariant(scoredCollege, "expected college to be scored");
      return {
        name: college.name,
        score: scoredCollege.score,
        matches: scoredCollege.scoreDetails
          .filter(
            (scoreDetail) =>
              scoreDetail.matched && scoreDetail.collegeId === college.id
          )
          .map((scoreDetail) => scoreDetail.match_value),
      };
    })
    .sort((a, b) => b.score - a.score);
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  invariant(params.assessmentId, "expected params.assessmentId");
  const scoredAssessment = await scoringApi.scoreAssessment(
    params.assessmentId
  );
  const colleges = await collegeApi.getColleges();
  const results = buildViewModal({ colleges, scoredAssessment });
  return { results };
};

export default function Results() {
  const { results } = useLoaderData<LoaderData>();
  return (
    <div>
      <main>
        <h4>
          Assessment Results{" "}
          <small>
            <a href="/assessments">Back to Assessments</a>
          </small>
        </h4>
        <table>
          <thead>
            <tr>
              <th>College</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => {
              return (
                <tr>
                  <td>{result.name}</td>
                  <td>{result.score}</td>
                  <td>{result.matches.sort().join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}
