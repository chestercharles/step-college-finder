export type ScoredCollege = {
  collegeId: string;
  score: number;
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
