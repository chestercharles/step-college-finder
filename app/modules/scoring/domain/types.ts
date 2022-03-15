export type QuestionToScore = {
  id: string;
  exclusive: boolean;
  match_value: string;
  exclude_value: string;
};

export type ScoreDetail = {
  questionId: string;
  yourAnswer: string;
  matched: boolean;
  match_value: string;
  collegeId: string;
};

export type ScoredCollege = {
  collegeId: string;
  score: number;
  scoreDetails: ScoreDetail[];
};

export type ScoredAssessment = {
  assessmentId: string;
  scoredColleges: ScoredCollege[];
};

export type AssessmentToScore = {
  id: string;
  responses: {
    responseValues: string[];
    questionId: string;
  }[];
};

export type CollegeToScore = {
  id: string;
  attribute_values: {
    value: string;
    question_id: string;
  }[];
};
