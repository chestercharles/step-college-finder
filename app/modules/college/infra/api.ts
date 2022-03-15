import { CollegeRepo } from "~/modules/college/infra";
import { GetAttributeValuesForQuestion } from "~/modules/college/application";

export namespace api {
  export type AttribueValueDTO = {
    value: string;
    question_id: string;
  };
  type getAttributeValuesForQuestion = (
    question_id: string
  ) => Promise<api.AttribueValueDTO[]>;
  export const getAttributeValuesForQuestion: getAttributeValuesForQuestion =
    async (question_id) => {
      const collegeRepo = CollegeRepo();
      const attributeValues = await GetAttributeValuesForQuestion(collegeRepo)({
        question_id,
      });
      return attributeValues;
    };
}
