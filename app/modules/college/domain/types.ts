export type AttributeValue = {
  value: string;
  question_id: string;
};

export type College = {
  name: string;
  attribute_values: AttributeValue[];
};
