import { ScoreAssessment } from "../application";
import { api as assessmentApi } from "../../assessment/infra";
import { api as collegeApi } from "../../college/infra";
import { ScoredAssessment } from "~/modules/scoring/domain";

export namespace api {
  export type ScoredAssessmentDTO = {
    assessmentId: string;
    scoredColleges: {
      collegeId: string;
      score: number;
    }[];
  };
  type scoreAssessment = (assessmentId: string) => Promise<ScoredAssessment>;
  export const scoreAssessment: scoreAssessment = async (assessmentId) => {
    const scoreAssessment = ScoreAssessment({
      getAssessment: assessmentApi.getAssessment,
      getColleges: collegeApi.getColleges,
    });
    const scoredAssessment = await scoreAssessment(assessmentId);
    return scoredAssessment;
  };
}
