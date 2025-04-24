/* eslint-disable @typescript-eslint/no-explicit-any */
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getEssayAssessmentById(
  assessmentId: string,
  type: "essay" | "identification"
): Promise<EssayAssessment> {
  const endpoint =
    type === "essay"
      ? `${baseUrl}/essay-assessment/${assessmentId}`
      : `${baseUrl}/identification-assessment/${assessmentId}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch assessment name");
  }

  const data = await response.json();
  const returnData = {
    id: data.id,
    name: data.name,
    type,
    essayCriteria: data.essayQuestions[0].essayCriteria.map(
      (criterion: any) => {
        const returnCriterion = {
          criteria: criterion.criteria,
          maxScore: criterion.maxScore,
          rubrics: criterion.rubrics.map((rubric: any) => {
            return {
              score: rubric.score,
              description: rubric.description,
            };
          }),
        };
        return returnCriterion;
      }
    ),
  };
  return returnData;
}

export async function getIdentificationAssessmentById(
  assessmentId: string,
  type: "identification"
): Promise<IdentificationAssessment> {
  const endpoint = `${baseUrl}/identification-assessment/${assessmentId}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch identification assessment");
  }
  const data = await response.json();

  const returnData: IdentificationAssessment = {
    id: data.id,
    name: data.name,
    type,
    identificationQuestions: data.identificationQuestions.map(
      (question: any) => ({
        id: question.id,
        number: question.number,
        correctAnswer: question.correctAnswer,
      })
    ),
  };

  return returnData;
}
