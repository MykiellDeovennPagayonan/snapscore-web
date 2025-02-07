/* eslint-disable @typescript-eslint/no-explicit-any */
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function updateEssayCriteriaResult(
  id: string,
  score: number
): Promise<any> {
  const response = await fetch(`${baseUrl}/essay-results/criteria/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update criteria result: ${response.statusText}`);
  }
  return response.json();
}

export async function updateEssayQuestionResult(
  id: string,
  score: number
): Promise<any> {
  const response = await fetch(`${baseUrl}/essay-results/question/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update question result: ${response.statusText}`);
  }
  return response.json();
}

export async function updateEssayResult(
  id: string,
  score: number
): Promise<any> {
  const response = await fetch(`${baseUrl}/essay-results/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ score }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update essay result: ${response.statusText}`);
  }
  return response.json();
}
