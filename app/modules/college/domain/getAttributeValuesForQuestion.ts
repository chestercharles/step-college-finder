import { College, AttributeValue } from "./types";

type getAttributeValuesForQuestion = (params: {
  colleges: College[];
  question_id: string;
}) => AttributeValue[];

function unique<T>(value: T, index: number, self: Array<T>) {
  return self.indexOf(value) === index;
}

export const getAttributeValuesForQuestion: getAttributeValuesForQuestion = ({
  colleges,
  question_id,
}) => {
  return colleges
    .flatMap((college) => college.attribute_values)
    .filter((attribute_value) => attribute_value.question_id === question_id)
    .map((attribute_value) => attribute_value.value)
    .filter(unique)
    .map((value) => ({
      value,
      question_id,
    }));
};
