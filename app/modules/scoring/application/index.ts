import { scoreCollege } from "~/modules/scoring/domain/scoreCollege";
import { AssessmentToScore, ScoredAssessment, CollegeToScore } from "../domain";

export type IGetAssessment = (id: string) => Promise<AssessmentToScore>;

export type IGetColleges = () => Promise<CollegeToScore[]>;

type ScoreAssessment = (deps: {
  getAssessment: IGetAssessment;
  getColleges: IGetColleges;
}) => (assessmentId: string) => Promise<ScoredAssessment>;
export const ScoreAssessment: ScoreAssessment =
  (deps) => async (assessmentId) => {
    const assessment = await deps.getAssessment(assessmentId);
    const colleges = await deps.getColleges();
    const scoredColleges = colleges.map((college) =>
      scoreCollege({ college, assessment })
    );
    return {
      assessmentId,
      scoredColleges,
    };
  };
