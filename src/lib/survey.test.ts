import { describe, expect, it } from "vitest";
import { surveyQuestionCount, surveySections, validateSurveyPayload } from "./survey";

function completeAnswers() {
  return Object.fromEntries(surveySections.flatMap((section) => section.questions.map((question) => [question.id, question.kind === "matrix" ? Object.fromEntries((question.rows ?? []).map((row) => [row, question.perRowMultiple ? [question.options?.[0] ?? "选择"] : question.options?.[0] ?? "选择"])) : question.kind === "multiple" ? [question.options?.[0] ?? "选择"] : question.kind === "text" ? "" : question.options?.[0] ?? "选择"])));
}

describe("survey questionnaire", () => {
  it("keeps the full 26-question survey in five parts", () => {
    expect(surveyQuestionCount).toBe(26);
    expect(surveySections).toHaveLength(5);
  });

  it("accepts a complete response with optional answers left blank", () => {
    const answers = completeAnswers();
    delete answers.q12;
    delete answers.q24;
    delete answers.q26;
    expect(validateSurveyPayload({ answers })).toBe(true);
  });

  it("rejects missing required questions, unknown options, and oversized selections", () => {
    const answers = completeAnswers();
    delete answers.q7;
    expect(validateSurveyPayload({ answers })).toBe(false);
    const invalidOption = completeAnswers();
    invalidOption.q7 = "不存在的选项";
    expect(validateSurveyPayload({ answers: invalidOption })).toBe(false);
    const tooMany = completeAnswers();
    tooMany.q6 = ["互联网 / 科技", "消费 / 零售", "教育", "金融"];
    expect(validateSurveyPayload({ answers: tooMany })).toBe(false);
  });

  it("rejects unknown fields and long free-text responses", () => {
    const answers = completeAnswers();
    answers.q26 = "x".repeat(3001);
    expect(validateSurveyPayload({ answers })).toBe(false);
    const withExtra = completeAnswers();
    withExtra.privateData = "not allowed";
    expect(validateSurveyPayload({ answers: withExtra })).toBe(false);
  });
});
