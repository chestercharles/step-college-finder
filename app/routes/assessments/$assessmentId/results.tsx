import React from "react";
import invariant from "invariant";
import { LoaderFunction, useLoaderData } from "remix";
import { api as scoringApi } from "~/modules/scoring/infra";
import { api as collegeApi } from "~/modules/college/infra";
import { Button, Container, Main } from "~/components";
import { attributes } from "~/attributes";
import { Tag } from "~/components/Tag";
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
  type,
}: {
  title: string;
  colleges: FormattedScoredCollege[];
  type: "primary" | "secondary" | "tertiary";
}) {
  return (
    <>
      <thead>
        <tr
          className={
            {
              primary: "table-success",
              secondary: "table-primary",
              tertiary: "table-secondary",
            }[type]
          }
        >
          <th colSpan={4}>
            <h5>{title}</h5>
          </th>
        </tr>
        <tr>
          <th>College</th>
          <th>Features</th>
          <th>Acceptance Rate</th>
          <th>Top Financial Aid School</th>
        </tr>
      </thead>
      <tbody>
        {colleges.map((college) => {
          const collegeAttributes = attributes.find(
            (a) => a.School === college.name
          );
          return (
            <tr>
              <td>{college.name}</td>
              <td>
                {college.matches.sort().map((m) => (
                  <Tag tag={m} />
                ))}
              </td>
              <td>{collegeAttributes?.["Acceptance Rate"]}</td>
              <td>
                {collegeAttributes?.["Top Financial Aid School"] === "Yes" ? (
                  <>&#11088;</>
                ) : (
                  ""
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}

export default function Results() {
  const results = useLoaderData<LoaderData>();
  const [showOtherColleges, setShowOtherColleges] = React.useState(false);
  return (
    <Container>
      <Main>
        <h4>
          Assessment Results{" "}
          <small>
            <a href="/assessments">Back to Assessments</a>
          </small>
        </h4>
        <table className="table">
          <ScoreTable
            title="Top Choices"
            type="primary"
            colleges={results.topColleges}
          />
          <ScoreTable
            title="Other Good Choices"
            type="secondary"
            colleges={results.otherGoodChoices}
          />
          <tr></tr>

          {showOtherColleges && (
            <ScoreTable
              title="Other Colleges"
              type="tertiary"
              colleges={results.otherResults}
            />
          )}
        </table>
        {!showOtherColleges && (
          <Button onClick={() => setShowOtherColleges(true)}>
            Show other colleges
          </Button>
        )}
      </Main>
    </Container>
  );
}
