import { expect } from "chai";
import { startAssessment } from "./index";

describe("assessment.domain.startAssessment", function () {
  it("should return a new in-progress assessment", function () {
    const userId = "user-id";
    const assessment = startAssessment(userId);
    expect(assessment.userId).to.equal(userId);
    expect(assessment.responses).to.be.empty;
    expect(assessment.completeDate).to.be.null;
    expect(assessment.id).to.exist;
    expect(assessment.startDate).to.be.instanceOf(Date);
  });
});
