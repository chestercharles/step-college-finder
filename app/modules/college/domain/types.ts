export type AttributeValue = {
  value: string;
  question_id: string;
};

export type College = {
  id: string;
  name: string;
  attribute_values: AttributeValue[];
};
