const uuid = require("uuid");

const q1Id = "08e64644-9099-453b-9e19-1ba98a84d4d3";
const q2Id = "9ed19f22-edbd-4517-9ca6-2c73702ccfe4";
const q3Id = "8bf6a449-09d2-4bf9-a884-6512c165abe3";
const q4Id = "5b0c0af9-1332-4a2b-94f1-8a5bf5a47054";
const q5Id = "f0e9ebd4-e7fd-4b38-8c2c-af716a54d5b8";
const q6Id = "cdcd32ed-371c-4a4c-9654-7714e0cf07e5";
const q7Id = "b4376677-256e-4e6b-9012-cf21c1f12297";
const q8Id = "25be5b9f-cfc4-42ed-a9e4-b928145371f8";

const collegeId1 = "75bcf28c-6c49-4389-9b9b-47e602d9ce30";
const collegeId2 = "7659ce46-0e8b-4a12-9806-c9ab75bfb584";
const collegeId3 = "6960bd53-f4c6-40b2-9ed0-0a0e5800aefd";

const q1_value_rural = "rural";
const q1_value_urban = "urban";

const q2_value_optional = "optional";
const q2_value_required = "required";

const q3_value_large = "large";
const q3_value_small = "small";

const q4_value_engineering = "engineering";
const q4_value_business = "business";
const q4_value_nursing = "nursing";
const q4_value_computer_science = "computer science";
const q4_value_music = "music";
const q4_value_art = "art";
const q4_value_architecture = "architecture";

const q5_value_yes = "yes";
const q5_value_no = "no";

const q6_value_yes = "yes";
const q6_value_no = "no";

const q7_value_yes = "yes";
const q7_value_no = "no";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("attribute_values").del();
  await knex("colleges").del();
  await knex("questions").del();

  await knex("questions").insert([
    {
      id: q1Id,
      prompt: "Do you have a location preference?",
      order: 1,
      skip_value: "I have no preference",
      is_boolean: true,
      exclusive: false,
    },
    {
      id: q2Id,
      prompt: "Will you be submitting official standardized test scores?",
      order: 2,
      skip_value: "",
      is_boolean: true,
      exclusive: false,
    },
    {
      id: q3Id,
      prompt: "In which classroom will you thrive?",
      order: 3,
      skip_value: "Either",
      is_boolean: true,
      exclusive: false,
    },
    {
      id: q4Id,
      prompt: "Are any of these majors what you plan to study?",
      order: 4,
      skip_value: "Either",
      is_boolean: true,
      exclusive: false,
    },
    {
      id: q5Id,
      prompt: "Are any of these majors what you plan to study?",
      order: 5,
      skip_value: "I have a different major in mind",
      is_boolean: false,
      exclusive: false,
    },
    {
      id: q6Id,
      prompt: "Are you interested in the military academies?",
      order: 6,
      skip_value: "",
      is_boolean: true,
      exclusive: false,
    },
    {
      id: q7Id,
      prompt:
        "Do you identify as a woman? (includes cis, trans, and nonbinary)",
      order: 7,
      skip_value: "",
      is_boolean: true,
      exclusive: true,
    },
    {
      id: q8Id,
      prompt: "Do you identify as Native or Black?",
      order: 8,
      skip_value: "",
      is_boolean: true,
      exclusive: true,
    },
  ]);

  await knex("colleges").insert({ id: collegeId1, name: "Amherst College" });
  await knex("attribute_values").insert([
    {
      id: uuid.v4(),
      question_id: q1Id,
      college_id: collegeId1,
      value: q1_value_rural,
    },
    {
      id: uuid.v4(),
      question_id: q2Id,
      college_id: collegeId1,
      value: q2_value_optional,
    },
    {
      id: uuid.v4(),
      question_id: q3Id,
      college_id: collegeId1,
      value: q3_value_small,
    },
    {
      id: uuid.v4(),
      question_id: q4Id,
      college_id: collegeId1,
      value: q4_value_computer_science,
    },
    {
      id: uuid.v4(),
      question_id: q4Id,
      college_id: collegeId1,
      value: q4_value_music,
    },
    {
      id: uuid.v4(),
      question_id: q4Id,
      college_id: collegeId1,
      value: q4_value_art,
    },
    {
      id: uuid.v4(),
      question_id: q5Id,
      college_id: collegeId1,
      value: q5_value_no,
    },
    {
      id: uuid.v4(),
      question_id: q6Id,
      college_id: collegeId1,
      value: q6_value_no,
    },
    {
      id: uuid.v4(),
      question_id: q6Id,
      college_id: collegeId1,
      value: q7_value_no,
    },
  ]);

  await knex("colleges").insert({ id: collegeId2, name: "Barnard College" });
  await knex("attribute_values").insert([
    {
      id: uuid.v4(),
      question_id: q1Id,
      college_id: collegeId2,
      value: q1_value_urban,
    },
    {
      id: uuid.v4(),
      question_id: q2Id,
      college_id: collegeId2,
      value: q2_value_optional,
    },
    {
      id: uuid.v4(),
      question_id: q3Id,
      college_id: collegeId2,
      value: q3_value_small,
    },
    {
      id: uuid.v4(),
      question_id: q4Id,
      college_id: collegeId2,
      value: q4_value_architecture,
    },
    {
      id: uuid.v4(),
      question_id: q4Id,
      college_id: collegeId2,
      value: q4_value_music,
    },
    {
      id: uuid.v4(),
      question_id: q4Id,
      college_id: collegeId2,
      value: q4_value_art,
    },
    {
      id: uuid.v4(),
      question_id: q5Id,
      college_id: collegeId2,
      value: q5_value_no,
    },
    {
      id: uuid.v4(),
      question_id: q6Id,
      college_id: collegeId2,
      value: q6_value_yes,
    },
    {
      id: uuid.v4(),
      question_id: q6Id,
      college_id: collegeId2,
      value: q7_value_no,
    },
  ]);
};
