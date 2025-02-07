export const createIdentificationAssessment = async (assessmentData: {
  name: string;
  firebaseId: string;
  answers: string[];
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const payload = {
    name: assessmentData.name,
    firebaseId: assessmentData.firebaseId,
    questions: assessmentData.answers.map(answer => ({ correctAnswer: answer })),
  };

  const response = await fetch(`${baseUrl}/identification-assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create assessment');
  }

  return response.json();
};
