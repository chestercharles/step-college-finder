import { expect } from "chai";
import { addResponseToAssessment } from "./index";
import type {
  InProgressAssessment,
  AssessmentResponse,
  CompletedAssessment,
} from "./index";

describe("assessment.domain.addResponseToAssessment", function () {
  it("should add a new response to an in progress assessment", function () {
    const existingResponse = {} as AssessmentResponse;
    const assessment: InProgressAssessment = {
      id: "assessment-id",
      userId: "user-id",
      startDate: new Date(),
      completeDate: null,
      responses: [existingResponse],
    };
    const responsePayload = {
      skipped: false,
      responseValues: ["response-value"],
      questionId: "question-id",
    };
    const updatedAssessment =
      addResponseToAssessment(assessment)(responsePayload);
    expect(updatedAssessment.responses.length).to.equal(2);

    const [, newResponse] = updatedAssessment.responses;
    expect(newResponse.id).to.exist;
    expect(newResponse.responseValues.includes("response-value")).to.be.true;
  });

  it("should not add a new response to a completed assessment", function () {
    const assessment: CompletedAssessment = {
      id: "assessment-id",
      userId: "user-id",
      startDate: new Date(),
      completeDate: new Date(),
      responses: [{} as AssessmentResponse],
    };
    const responsePayload = {
      skipped: false,
      responseValues: ["response-value"],
      questionId: "question-id",
    };

    expect(() =>
      addResponseToAssessment(assessment)(responsePayload)
    ).to.throw();
  });
});
