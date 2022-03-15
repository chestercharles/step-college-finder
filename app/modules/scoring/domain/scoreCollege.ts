import { CollegeToScore, AssessmentToScore, ScoredCollege } from "./types";

type scoreCollege = (params: {
  college: CollegeToScore;
  assessment: AssessmentToScore;
}) => ScoredCollege;
export const scoreCollege: scoreCollege = ({ college, assessment }) => {
  const scoreResponseAgainstCollege = ScoreResponseAgainstCollege(college);
  const score = assessment.responses
    .map(scoreResponseAgainstCollege)
    .reduce((totalScore, responseScore) => totalScore + responseScore, 0);
  return {
    collegeId: college.id,
    score,
  };
};

type ScoreResponseAgainstCollege = (
  college: CollegeToScore
) => (response: AssessmentToScore["responses"][0]) => number;
const ScoreResponseAgainstCollege: ScoreResponseAgainstCollege =
  (college) => (response) => {
    const questionId = response.questionId;
    const collegeAttributeValues = college.attribute_values.filter(
      (attribute_value) => attribute_value.question_id === questionId
    );
    const matchedResponses = response.responseValues.filter((responseValue) =>
      collegeAttributeValues.map((v) => v.value).includes(responseValue)
    );
    return matchedResponses.length;
  };
