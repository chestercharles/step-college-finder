import { v4 } from "uuid";
import { expect } from "chai";
import { Assessment } from "../domain";
import { getClient } from "../../../db.server";
import { AssessmentRepo } from "./index";

describe("assessment.infra.AssessmentRepo2", () => {
  before(async () => {
    const client = getClient();
    await client.migrate.latest();
  });

  beforeEach(async () => {
    const client = getClient();
    await client.raw("DELETE FROM response_values");
    await client.raw("DELETE FROM responses");
    await client.raw("DELETE FROM assessments");
    await client.raw("DELETE FROM attributes");
    await client.raw("DELETE FROM users");
  });

  after(async () => {
    const client = getClient();
  });

  async function createUser() {
    const user_id = v4();
    await getClient()("users").insert({
      id: user_id,
      email: "email",
      password: "password",
      first_name: "first",
      last_name: "last",
    });
    return user_id;
  }

  async function createAttribute() {
    const attributeId = v4();
    await getClient()("attributes").insert({
      id: attributeId,
      name: "attribute",
      is_boolean: false,
      exclusive: false,
    });
    return attributeId;
  }

  async function createAssessment(user_id: string) {
    const assessment: Assessment = {
      id: v4(),
      userId: user_id,
      startDate: new Date(),
      completeDate: null,
      responses: [],
    };
    return assessment;
  }

  it("should add a new assessment to the repo", async () => {
    const userId = await createUser();
    const assessment = await createAssessment(userId);
    const assessmentRepo = AssessmentRepo();
    await assessmentRepo.add(assessment);
  });

  it("should find a new assessment added to the repo", async () => {
    const userId = await createUser();
    const assessment = await createAssessment(userId);
    const assessmentRepo = AssessmentRepo();
    await assessmentRepo.add(assessment);
    const [foundAssessment] = await assessmentRepo.find({ id: assessment.id });
    expect(foundAssessment).to.exist;
    expect(foundAssessment.id).to.equal(assessment.id);
    expect(Boolean(foundAssessment.completeDate)).to.be.false;
    expect(foundAssessment.startDate).to.be.instanceOf(Date);
    expect(Array.isArray(foundAssessment.responses)).to.be.true;
    expect(foundAssessment.responses).to.be.empty;
    expect(foundAssessment.userId).to.equal(assessment.userId);
  });

  it("should find a updated an assessment ", async () => {
    const userId = await createUser();
    const assessment = await createAssessment(userId);
    const attributeId = await createAttribute();

    const assessmentRepo = AssessmentRepo();
    await assessmentRepo.add(assessment);

    const [foundAssessment] = await assessmentRepo.find({ id: assessment.id });
    const updatedAssessment: Assessment = {
      ...foundAssessment,
      completeDate: new Date(),
      responses: [
        {
          id: v4(),
          skipped: false,
          responseValues: ["a", "b", "c"],
          attributeId: attributeId,
        },
      ],
    };

    const foundUpdatedAssessment = await assessmentRepo.update(
      updatedAssessment
    );
    expect(foundUpdatedAssessment.startDate).to.be.instanceOf(Date);
    expect(foundUpdatedAssessment.completeDate).to.be.instanceOf(Date);
    const [response] = foundUpdatedAssessment.responses;
    expect(response.responseValues.length).to.equal(3);
  });

  it("should remove deleted responses", async () => {
    const userId = await createUser();
    const assessment = await createAssessment(userId);
    const attributeId = await createAttribute();

    const assessment1: Assessment = {
      ...assessment,
      completeDate: new Date(),
      responses: [
        {
          id: v4(),
          skipped: false,
          responseValues: ["a", "b", "c"],
          attributeId: attributeId,
        },
      ],
    };

    const assessmentRepo = AssessmentRepo();
    await assessmentRepo.add(assessment1);

    const assessment2: Assessment = {
      ...assessment1,
      responses: [
        {
          id: v4(),
          skipped: false,
          responseValues: ["d", "e", "f"],
          attributeId: attributeId,
        },
      ],
    };

    await assessmentRepo.update(assessment2);

    const [finalAssessment] = await assessmentRepo.find({ id: assessment2.id });

    expect(finalAssessment.responses.length).equals(1);

    const [response] = finalAssessment.responses;
    expect(response.responseValues.includes("d")).is.true;
    expect(response.responseValues.includes("e")).is.true;
    expect(response.responseValues.includes("f")).is.true;
  });

  it("should update responses", async () => {
    const userId = await createUser();
    const assessment = await createAssessment(userId);
    const attributeId = await createAttribute();

    const responseId = v4();

    const assessment1: Assessment = {
      ...assessment,
      completeDate: new Date(),
      responses: [
        {
          id: responseId,
          skipped: false,
          responseValues: ["a", "b", "c"],
          attributeId: attributeId,
        },
      ],
    };

    const assessmentRepo = AssessmentRepo();
    await assessmentRepo.add(assessment1);

    const assessment2: Assessment = {
      ...assessment1,
      responses: [
        {
          id: responseId,
          skipped: false,
          responseValues: ["d", "e", "f"],
          attributeId: attributeId,
        },
        {
          id: v4(),
          skipped: false,
          responseValues: ["g", "h", "i"],
          attributeId: attributeId,
        },
      ],
    };

    await assessmentRepo.update(assessment2);

    const [finalAssessment] = await assessmentRepo.find({ id: assessment2.id });

    expect(finalAssessment.responses.length).equals(2);

    const [response1, response2] = finalAssessment.responses;
    // console.log("original response id", responseId);
    // console.log(finalAssessment.responses);
    expect(response1.responseValues.includes("d")).is.true;
    expect(response1.responseValues.includes("e")).is.true;
    expect(response1.responseValues.includes("f")).is.true;
    expect(response2.responseValues.includes("g")).is.true;
    expect(response2.responseValues.includes("h")).is.true;
    expect(response2.responseValues.includes("i")).is.true;
  });
});
