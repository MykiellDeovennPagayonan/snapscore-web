// /utils/updateIdentificationResults.ts
export async function updateIdentificationResult(
  id: string,
  data: { studentName?: string }
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/identification-results/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'Failed to update identification result.'
    );
  }

  return await response.json();
}

export async function updateIdentificationQuestionResult(
  id: string,
  data: { isCorrect?: boolean }
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/identification-results/question/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'Failed to update identification question result.'
    );
  }

  return await response.json();
}
