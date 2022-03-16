import React from "react";
import invariant from "invariant";
import { LoaderFunction, useLoaderData } from "remix";
import { api as scoringApi } from "~/modules/scoring/infra";
import { api as collegeApi } from "~/modules/college/infra";

type FormattedScoredCollege = {
  name: string;
  score: number;
  matches: string[];
};

type LoaderData = {
  topColleges: FormattedScoredCollege[];
  otherGoodChoices: FormattedScoredCollege[];
  otherResults: FormattedScoredCollege[];
};

function buildViewModal(params: {
  scoredAssessment: scoringApi.ScoredAssessmentDTO;
  colleges: collegeApi.CollegeDTO[];
}) {
  const formattedColleges = params.colleges
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

  const scores = formattedColleges.map((f) => f.score);
  const maxScore = Math.max(...scores);
  const nextTopScore = Math.max(...scores.filter((s) => s < maxScore));

  return {
    topColleges: formattedColleges.filter((f) => f.score === maxScore),
    otherGoodChoices: formattedColleges.filter((f) => f.score === nextTopScore),
    otherResults: formattedColleges.filter((f) => f.score < nextTopScore),
  };
}

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  invariant(params.assessmentId, "expected params.assessmentId");
  const scoredAssessment = await scoringApi.scoreAssessment(
    params.assessmentId
  );
  const colleges = await collegeApi.getColleges();
  return buildViewModal({ colleges, scoredAssessment });
};

function ScoreTable({
  title,
  colleges,
}: {
  title: string;
  colleges: FormattedScoredCollege[];
}) {
  return (
    <>
      <h5>{title}</h5>
      <table>
        <thead>
          <tr>
            <th>College</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((college) => {
            return (
              <tr>
                <td>{college.name}</td>
                <td>{college.score}</td>
                <td>{college.matches.sort().join(", ")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default function Results() {
  const results = useLoaderData<LoaderData>();
  const [showOtherColleges, setShowOtherColleges] = React.useState(false);
  return (
    <div>
      <main>
        <h4>
          Assessment Results{" "}
          <small>
            <a href="/assessments">Back to Assessments</a>
          </small>
        </h4>
        <ScoreTable title="Top Choices" colleges={results.topColleges} />
        <ScoreTable
          title="Other Good Choices"
          colleges={results.otherGoodChoices}
        />
        <br />
        {!showOtherColleges && (
          <button onClick={() => setShowOtherColleges(true)}>
            Show other colleges
          </button>
        )}
        {showOtherColleges && (
          <ScoreTable title="Other Colleges" colleges={results.otherResults} />
        )}
      </main>
    </div>
  );
}
