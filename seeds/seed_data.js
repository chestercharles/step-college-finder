const csv = require("csv-parser");
const fs = require("fs");
const uuid = require("uuid");

const q1Id = "08e64644-9099-453b-9e19-1ba98a84d4d3";
const q2Id = "9ed19f22-edbd-4517-9ca6-2c73702ccfe4";
const q3Id = "8bf6a449-09d2-4bf9-a884-6512c165abe3";
const q4Id = "5b0c0af9-1332-4a2b-94f1-8a5bf5a47054";
const q5Id = "f0e9ebd4-e7fd-4b38-8c2c-af716a54d5b8";
const q6Id = "cdcd32ed-371c-4a4c-9654-7714e0cf07e5";
const q7Id = "b4376677-256e-4e6b-9012-cf21c1f12297";

async function readCSV(filename) {
  const results = [];
  return new Promise((resolve) => {
    fs.createReadStream(__dirname + "/" + filename)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("error", (err) => reject(err))
      .on("end", () => resolve(results));
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function insertAttribute({ collegeId, questionId, values }) {
    await knex("attribute_values").insert(
      values.map((value) => {
        return {
          id: uuid.v4(),
          question_id: questionId,
          college_id: collegeId,
          value: capitalizeFirstLetter(value.trim()),
        };
      })
    );
  }

  async function insertRow(row) {
    const { School, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9 } = row;
    const collegeId = uuid.v4();
    await knex("colleges").insert({ id: collegeId, name: School });
    await Promise.all([
      insertAttribute({ collegeId, questionId: q1Id, values: Q2.split(",") }),
      insertAttribute({ collegeId, questionId: q2Id, values: Q3.split(",") }),
      insertAttribute({ collegeId, questionId: q3Id, values: Q4.split(",") }),
      insertAttribute({ collegeId, questionId: q4Id, values: Q5.split(",") }),
      insertAttribute({ collegeId, questionId: q5Id, values: Q6.split(",") }),
      insertAttribute({ collegeId, questionId: q6Id, values: Q7.split(",") }),
      insertAttribute({ collegeId, questionId: q7Id, values: Q8.split(",") }),
    ]);
  }

  await knex("response_values").del();
  await knex("responses").del();
  await knex("assessments").del();
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
      exclusive: true,
      exclude_value: "No",
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
      skip_value: "I have a different major in mind",
      is_boolean: false,
      exclusive: false,
    },
    {
      id: q5Id,
      prompt: "Are you interested in the military academies?",
      order: 5,
      skip_value: "",
      is_boolean: true,
      exclusive: true,
      exclude_value: "No",
      match_value: "Military",
    },
    {
      id: q6Id,
      prompt:
        "Do you identify as a woman? (includes cis, trans, and nonbinary)",
      order: 6,
      skip_value: "",
      is_boolean: true,
      exclusive: true,
      exclude_value: "No",
      match_value: "Womens",
    },
    {
      id: q7Id,
      prompt: "Do you identify as Native or Black?",
      order: 7,
      skip_value: "",
      is_boolean: true,
      exclusive: true,
      exclude_value: "No",
      match_value: "Native/Black",
    },
  ]);
  const rows = await readCSV("../colleges.csv");
  await Promise.all(rows.map((row) => insertRow(row)));
};
