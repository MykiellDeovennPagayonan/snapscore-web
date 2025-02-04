const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getAssessmentName = async (assessmentId: string, type: "essay" | "identification") => {
  const endpoint = type === "essay" 
    ? `${baseUrl}/essay-assessment/${assessmentId}`
    : `${baseUrl}/identification-assessment/${assessmentId}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch assessment name");
  }
  
  const data = await response.json();
  return data.name;
};
