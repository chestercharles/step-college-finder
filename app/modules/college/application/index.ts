import {
  College,
  AttributeValue,
  getAttributeValuesForQuestion,
} from "../domain";

export type ICollegeRepo = {
  find: () => Promise<College[]>;
};

type GetAttributeValuesForQuestion = (
  collegeRepo: ICollegeRepo
) => (payload: { question_id: string }) => Promise<AttributeValue[]>;
export const GetAttributeValuesForQuestion: GetAttributeValuesForQuestion =
  (collegeRepo) => async (payload) => {
    const colleges = await collegeRepo.find();
    return getAttributeValuesForQuestion({
      question_id: payload.question_id,
      colleges,
    });
  };
