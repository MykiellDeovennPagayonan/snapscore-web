export const createIdentificationAssessment = async (assessmentData: {
  name: string;
  firebaseId: string;
  answers: string[];
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const response = await fetch(`${baseUrl}/identification-assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessmentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create assessment');
  }

  return response.json();
};
