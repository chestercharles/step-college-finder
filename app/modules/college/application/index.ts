import {
  College,
  AttributeValue,
  getAttributeValuesForQuestion,
} from "../domain";

export type ICollegeRepo = {
  find: (params?: { id?: string }) => Promise<College[]>;
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

type GetCollege = (
  collegeRepo: ICollegeRepo
) => (collegeId: string) => Promise<College>;
export const GetCollege: GetCollege = (collegeRepo) => async (collegeId) => {
  const [college] = await collegeRepo.find({ id: collegeId });
  if (!college) {
    throw new Error("College not found");
  }

  return college;
};
