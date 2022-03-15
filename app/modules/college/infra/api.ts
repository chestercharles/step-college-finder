import { CollegeRepo } from "~/modules/college/infra";
import {
  GetAttributeValuesForQuestion,
  GetCollege,
} from "~/modules/college/application";

export namespace api {
  export type CollegeDTO = {
    id: string;
    name: string;
    attribute_values: AttributeValueDTO[];
  };

  export type AttributeValueDTO = {
    value: string;
    question_id: string;
  };

  type getAttributeValuesForQuestion = (
    question_id: string
  ) => Promise<api.AttributeValueDTO[]>;
  export const getAttributeValuesForQuestion: getAttributeValuesForQuestion =
    async (question_id) => {
      const collegeRepo = CollegeRepo();
      const attributeValues = await GetAttributeValuesForQuestion(collegeRepo)({
        question_id,
      });
      return attributeValues;
    };

  type getCollege = (college_id: string) => Promise<api.CollegeDTO>;
  export const getCollege: getCollege = async (college_id) => {
    const collegeRepo = CollegeRepo();
    const college = await GetCollege(collegeRepo)(college_id);
    return college;
  };

  type getColleges = () => Promise<api.CollegeDTO[]>;
  export const getColleges: getColleges = async () => {
    const colleges = await CollegeRepo().find();
    return colleges;
  };
}
