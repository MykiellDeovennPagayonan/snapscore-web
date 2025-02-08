/* eslint-disable @typescript-eslint/no-explicit-any */
interface EssayCriteriaResult {
  id: string;
  score: number;
  criteriaId: string;
  criteria: {
    id: string;
    name: string;
    rubrics: Array<{
      id: string;
      description: string;
      score: number;
    }>;
  };
}

interface QuestionResult {
  id: string;
  answer: string;
  score: number;
  questionId: string;
  essayCriteriaResults: EssayCriteriaResult[];
}

interface EssayResult {
  id: string;
  studentName: string;
  score: number;
  createdAt: Date;
  assessment: {
    id: string;
    title: string;
  };
  questionResults: QuestionResult[];
}

interface FetchEssayResultsResponse {
  results: EssayResult[];
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getEssayResultByAssessmentId(assessmentId: string): Promise<FetchEssayResultsResponse> {
  const response = await fetch(
    `${baseUrl}/essay-results/assessment/${assessmentId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch essay results: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    results: data.map((result: any) => ({
      id: result.id,
      studentName: result.studentName,
      score: result.score,
      createdAt: new Date(result.createdAt),
      assessment: {
        id: result.assessment.id,
        title: result.assessment.title,
      },
      questionResults: result.questionResults.map((qr: any) => ({
        id: qr.id,
        answer: qr.answer,
        score: qr.score,
        questionId: qr.questionId,
        essayCriteriaResults: qr.essayCriteriaResults.map((cr: any) => ({
          id: cr.id,
          score: cr.score,
          criteriaId: cr.criteriaId,
          criteria: {
            id: cr.criteria.id,
            name: cr.criteria.name,
            rubrics: cr.criteria.rubrics,
          },
        })),
      })),
    })),
  };
}