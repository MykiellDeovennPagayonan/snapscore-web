/* eslint-disable @typescript-eslint/no-explicit-any */
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchEssayResults(assessmentId: string) {
  const response = await fetch(
    `${baseUrl}/essay-results/assessment/${assessmentId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch essay results");
  }
  const data = await response.json();
  console.log(data)
  return {
    results: data.map((result: any) => ({
      id: result.id,
      studentName: result.studentName,
      score: result.score,
      createdAt: new Date(result.createdAt),
    })),
  };
}

export async function fetchIdentificationResults(assessmentId: string) {
  const response = await fetch(
    `${baseUrl}/identification-results/assessment/${assessmentId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch identification results");
  }
  const data = await response.json();
  console.log(data)
  return {
    results: data.map((result: any) => ({
      id: result.id,
      studentName: result.studentName,
      score: result.score,
      createdAt: new Date(result.createdAt),
    })),
  };
}

export async function getEssayResultById(id: string): Promise<EssayResult> {
  const response = await fetch(`${baseUrl}/essay-results/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch essay result: ${response.statusText}`);
  }

  const result = await response.json()

  console.log(result)

  return result
}

export async function getIdentificationResultById(id: string): Promise<IdentificationResult> {
  const response = await fetch(`${baseUrl}/identification-results/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch identification result: ${response.statusText}`);
  }

  const result = await response.json();

  console.log(result);

  return result;
}