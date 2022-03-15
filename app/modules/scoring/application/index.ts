import { scoreCollege } from "~/modules/scoring/domain/scoreCollege";
import {
  AssessmentToScore,
  ScoredAssessment,
  CollegeToScore,
  QuestionToScore,
} from "../domain";

export type IGetAssessment = (id: string) => Promise<AssessmentToScore>;
export type IGetColleges = () => Promise<CollegeToScore[]>;
export type IGetQuestions = () => Promise<QuestionToScore[]>;

type ScoreAssessment = (deps: {
  getAssessment: IGetAssessment;
  getColleges: IGetColleges;
  getQuestions: IGetQuestions;
}) => (assessmentId: string) => Promise<ScoredAssessment>;
export const ScoreAssessment: ScoreAssessment =
  (deps) => async (assessmentId) => {
    const assessment = await deps.getAssessment(assessmentId);
    const colleges = await deps.getColleges();
    const questions = await deps.getQuestions();
    const scoredColleges = colleges.map((college) =>
      scoreCollege({ college, assessment, questions })
    );
    return {
      assessmentId,
      scoredColleges,
    };
  };
