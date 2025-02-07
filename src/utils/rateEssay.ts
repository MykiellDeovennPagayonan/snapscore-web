const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function rateEssay(
  file: File,
  assessmentId: string,
  essayCriteria: EssayCriteria
) {
  const formData = new FormData();
  formData.append('image', file);
  console.log('assessmentId', assessmentId);
  formData.append('essayCriteria', JSON.stringify(essayCriteria));

  const response = await fetch(`${baseUrl}/essay/${assessmentId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to rate the essay');
  }

  const data = await response.json();
  console.log(data);

  return {
    id: data.id,
    studentName: data.studentName,
    score: data.score,
    createdAt: new Date(data.createdAt),
  };
}
