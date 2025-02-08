const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function checkIdentification(file: File, assessmentId: string) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${baseUrl}/identification/${assessmentId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to process identification');
  }

  const data = await response.json();
  console.log("Identification API response:", data);

  return {
    id: data.id,
    studentName: data.studentName,
    items: data.questionResults,
    createdAt: new Date(data.createdAt),
  };
}
