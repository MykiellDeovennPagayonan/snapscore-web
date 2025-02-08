type EssayAssessment = {
  id: string
  name: string
  type: "essay" | "identification"
  essayCriteria: EssayCriteria
}

type EssayCriteria = {
  criteria: string;
  maxScore: number;
  rubrics: { score: string; description: string };
}[]

type EssayCriteriaResult = {
  id: string;
  criteria: {
    criteria: string;
    maxScore: number;
  };
  score: number;
  maxScore: number;
  criteriaId: string;
}

type QuestionResult = {
  id: string;
  answer: string;
  score: number;
  questionId: string;
  essayCriteriaResults: EssayCriteriaResult[];
}

type Assessment = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

type EssayResult = {
  id: string;
  studentName: string;
  score: number;
  paperImage: string;
  assessmentId: string;
  createdAt: string;
  assessment: Assessment;
  questionResults: QuestionResult[];
}

type IdentificationQuestion = {
  id: string;
  correctAnswer: string;
}

type IdentificationAssessment = {
  id: string;
  name: string;
  type: "identification";
  identificationQuestions: IdentificationQuestion[];
}