import { v4 } from "uuid";
import { getClient } from "../../../db.server";
import type { IAssessmentRepo } from "../application";
import type { Assessment, AssessmentResponse } from "../domain";

type AssessmentsDbRow = {
  id: string;
  user_id: string;
  start_date: number;
  complete_date: number | undefined;
};

type ResponseDbRow = {
  id: string;
  assessment_id: string;
  question_id: string;
  skipped: boolean;
  created_date: Date;
};

type ResponseValueDbRow = {
  id: string;
  response_id: string;
  value: string;
};

export const AssessmentRepo: () => IAssessmentRepo = () => {
  const client = getClient();
  return {
    add: async (assessment) => {
      await client
        .insert({
          id: assessment.id,
          user_id: assessment.userId,
          start_date: assessment.startDate,
          complete_date: assessment.completeDate,
        })
        .into("assessments");

      await insertNewResponsesAndResponseValues(
        assessment.responses,
        assessment.id
      );

      return assessment;
    },
    update: async (assessment) => {
      await client("assessments")
        .update({
          user_id: assessment.userId,
          start_date: assessment.startDate,
          complete_date: assessment.completeDate,
        })
        .where("id", assessment.id);

      const existingResponseIds = await getExistingResponseIds(assessment.id);
      const newResponseIds = assessment.responses.map(
        (response) => response.id
      );
      const responseIdsToDelete = existingResponseIds.filter(
        (responseId) => !newResponseIds.includes(responseId)
      );
      await deleteResponsesAndResponseValues(responseIdsToDelete);

      const newResponses = assessment.responses.filter(
        (response) => !existingResponseIds.includes(response.id)
      );
      await insertNewResponsesAndResponseValues(newResponses, assessment.id);

      const responsesToUpdate = assessment.responses.filter((response) =>
        existingResponseIds.includes(response.id)
      );
      await updateResponsesAndResponseValues(responsesToUpdate);

      return assessment;
    },
    find: async (params) => {
      const qb = client<AssessmentsDbRow>("assessments");

      if (params.id) {
        qb.where("id", params.id);
      }

      const assessments = await qb;
      return buildAssessments(assessments);
    },
  };
};

async function insertNewResponsesAndResponseValues(
  responses: AssessmentResponse[],
  assessmentId: string
) {
  if (responses.length === 0) return;

  const client = getClient();
  await client
    .insert(
      responses.map((response) => {
        return {
          id: response.id,
          assessment_id: assessmentId,
          question_id: response.questionId,
          skipped: response.skipped,
        };
      })
    )
    .into("responses");

  await client
    .insert(
      responses.flatMap((response) => {
        return response.responseValues.map((value) => {
          return {
            id: v4(),
            response_id: response.id,
            value: value,
          };
        });
      })
    )
    .into("response_values");
}

async function deleteResponsesAndResponseValues(responseIdsToDelete: string[]) {
  const client = getClient();
  await client("response_values")
    .delete()
    .whereIn("response_id", responseIdsToDelete);
  await client("responses").delete().whereIn("id", responseIdsToDelete);
}

async function updateResponsesAndResponseValues(
  responses: AssessmentResponse[]
) {
  const client = getClient();
  await Promise.all(
    responses.map((response) => {
      client("responses")
        .update({
          skipped: response.skipped,
        })
        .where("id", response.id);
    })
  );

  await client("response_values")
    .delete()
    .whereIn(
      "response_id",
      responses.map((response) => response.id)
    );

  await Promise.all(
    responses.flatMap((response) =>
      response.responseValues.map((responseValue) =>
        client("response_values").insert({
          id: v4(),
          response_id: response.id,
          value: responseValue,
        })
      )
    )
  );
}

async function getExistingResponseIds(assessmentId: string): Promise<string[]> {
  const client = getClient();
  const existingResponses = await client<ResponseDbRow>("responses").where(
    "assessment_id",
    assessmentId
  );
  return existingResponses.map((response) => response.id);
}

async function buildAssessments(assessmentDbRows: AssessmentsDbRow[]) {
  type AssessmentResponseWithAssessmentId = AssessmentResponse & {
    assessment_id: string;
  };

  function _buildResponses(
    responses: ResponseDbRow[],
    responseValues: ResponseValueDbRow[]
  ): AssessmentResponseWithAssessmentId[] {
    return responses.map((response) => {
      return {
        id: response.id,
        assessment_id: response.assessment_id,
        questionId: response.question_id,
        skipped: response.skipped,
        responseValues: responseValues
          .filter((responseValue) => responseValue.response_id === response.id)
          .map((responseValue) => responseValue.value),
      };
    });
  }

  function _buildAssessments(
    assessments: AssessmentsDbRow[],
    responses: AssessmentResponseWithAssessmentId[]
  ): Assessment[] {
    return assessments.map((assessment) => {
      return {
        id: assessment.id,
        userId: assessment.user_id,
        startDate: new Date(assessment.start_date),
        completeDate: assessment.complete_date
          ? new Date(assessment.complete_date)
          : null,
        responses: responses.filter(
          (response) => response.assessment_id === assessment.id
        ),
      };
    });
  }

  const client = getClient();
  const responseDbRows = await client<ResponseDbRow>("responses").whereIn(
    "assessment_id",
    assessmentDbRows.map((assessment) => assessment.id)
  );
  const responseValueDbRows = await client<ResponseValueDbRow>(
    "response_values"
  ).whereIn(
    "response_id",
    responseDbRows.map((response) => response.id)
  );
  const responses = _buildResponses(responseDbRows, responseValueDbRows);
  const assessments = _buildAssessments(assessmentDbRows, responses);

  return assessments;
}
