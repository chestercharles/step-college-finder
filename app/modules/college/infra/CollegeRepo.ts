import { getClient } from "../../../db.server";
import { ICollegeRepo } from "../application";
import { College } from "../domain";

type CollegeDbRow = {
  id: string;
  name: string;
};

type AttributeValueDbRow = {
  id: string;
  value: string;
  question_id: string;
  college_id: string;
};

export const CollegeRepo: () => ICollegeRepo = () => {
  const client = getClient();
  return {
    find: async () => {
      return buildColleges({
        collegeDbRows: await client<CollegeDbRow>("colleges"),
        attributeValueDbRows: await client<AttributeValueDbRow>(
          "attribute_values"
        ),
      });
    },
  };
};

function buildColleges(params: {
  collegeDbRows: CollegeDbRow[];
  attributeValueDbRows: AttributeValueDbRow[];
}): College[] {
  const colleges = params.collegeDbRows.map((collegeDbRow) => {
    const attribute_values = params.attributeValueDbRows
      .filter((attributeValueDbRow) => {
        return attributeValueDbRow.college_id === collegeDbRow.id;
      })
      .map((attributeValueDbRow) => {
        return {
          id: attributeValueDbRow.id,
          value: attributeValueDbRow.value,
          question_id: attributeValueDbRow.question_id,
        };
      });
    return {
      id: collegeDbRow.id,
      name: collegeDbRow.name,
      attribute_values,
    };
  });
  return colleges;
}
