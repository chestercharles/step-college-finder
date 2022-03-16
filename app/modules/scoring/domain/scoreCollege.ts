import {
  CollegeToScore,
  AssessmentToScore,
  ScoredCollege,
  QuestionToScore,
  ScoreDetail,
} from "./types";

type scoreCollege = (params: {
  college: CollegeToScore;
  assessment: AssessmentToScore;
  questions: QuestionToScore[];
}) => ScoredCollege;
export const scoreCollege: scoreCollege = ({
  college,
  assessment,
  questions,
}) => {
  const scoreResponseAgainstCollege = ScoreResponseAgainstCollege({
    college,
    questions,
  });
  const scoreDetails = assessment.responses.flatMap(
    scoreResponseAgainstCollege
  );

  const totalScore = calculateTotalScore({ scoreDetails, questions, college });
  return {
    collegeId: college.id,
    scoreDetails,
    score: totalScore,
  };
};

type ScoreResponseAgainstCollege = (params: {
  college: CollegeToScore;
  questions: QuestionToScore[];
}) => (response: AssessmentToScore["responses"][0]) => ScoreDetail[];
const ScoreResponseAgainstCollege: ScoreResponseAgainstCollege =
  ({ college, questions }) =>
  (response) => {
    const shouldExclude = ShouldExlude(questions);
    const questionId = response.questionId;
    const collegeAttributeValues = college.attribute_values
      .filter((attribute_value) => attribute_value.question_id === questionId)
      .map((v) => v.value);
    return response.responseValues
      .filter((responseValue) => collegeAttributeValues.includes(responseValue))
      .filter((responseValue) => !shouldExclude({ questionId, responseValue }))
      .map((responseValue) => {
        return {
          questionId,
          collegeId: college.id,
          yourAnswer: responseValue,
          match_value:
            questions.find((q) => q.id === questionId)?.match_value ||
            responseValue,
          matched: true,
        };
      })
      .filter((detail) => !["Yes", "No"].includes(detail.match_value));
  };

type calculateTotalScore = (params: {
  college: CollegeToScore;
  scoreDetails: ScoreDetail[];
  questions: QuestionToScore[];
}) => number;
const calculateTotalScore: calculateTotalScore = (params) => {
  const exclusiveQuestions = params.questions.filter((q) => q.exclusive);

  for (const exclusiveQuestion of exclusiveQuestions) {
    const scoreDetail = params.scoreDetails.find(
      (scoreDetails) => scoreDetails.questionId === exclusiveQuestion.id
    );
    if (!scoreDetail) {
      const collegeValues = params.college.attribute_values
        .filter((v) => v.question_id === exclusiveQuestion.id)
        .map((c) => c.value);

      if (!collegeValues.includes(exclusiveQuestion.exclude_value)) {
        return 0;
      }
    }
  }

  return params.scoreDetails.reduce((totalScore, scoreDetail) => {
    return totalScore + (scoreDetail.matched ? 1 : 0);
  }, 0);
};

type ShouldExlude = (
  questions: QuestionToScore[]
) => (params: { questionId: string; responseValue: string }) => boolean;
const ShouldExlude: ShouldExlude = (questions) => (params) => {
  const exclusiveQuestion = questions.find(
    (q) => q.exclusive && q.id === params.questionId
  );

  if (exclusiveQuestion) {
    return exclusiveQuestion.exclude_value === params.responseValue;
  }

  return false;
};
