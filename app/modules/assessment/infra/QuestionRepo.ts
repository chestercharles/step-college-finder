import { IQuestionRepo } from "../application";
import { getClient } from "../../../db.server";

type QuestionDbRow = {
  id: string;
  prompt: string;
  skip_value: string;
  exclusive: boolean;
  is_boolean: boolean;
};

export const QuestionRepo: () => IQuestionRepo = () => {
  const client = getClient();
  return {
    find: async () => {
      const questions = await client<QuestionDbRow>("questions").orderBy(
        "order",
        "asc"
      );

      return questions;
    },
  };
};
