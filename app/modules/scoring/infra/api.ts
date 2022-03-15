import { ScoreAssessment } from "../application";
import { api as assessmentApi } from "../../assessment/infra";
import { api as collegeApi } from "../../college/infra";

export namespace api {
  export type ScoredAssessmentDTO = {
    assessmentId: string;
    scoredColleges: {
      collegeId: string;
      scoreDetails: {
        questionId: string;
        collegeId: string;
        yourAnswer: string;
        matched: boolean;
        match_value: string;
      }[];
      score: number;
    }[];
  };
  type scoreAssessment = (assessmentId: string) => Promise<ScoredAssessmentDTO>;
  export const scoreAssessment: scoreAssessment = async (assessmentId) => {
    const scoreAssessment = ScoreAssessment({
      getAssessment: assessmentApi.getAssessment,
      getQuestions: assessmentApi.getQuestions,
      getColleges: collegeApi.getColleges,
    });
    const scoredAssessment = await scoreAssessment(assessmentId);
    return scoredAssessment;
  };
}
