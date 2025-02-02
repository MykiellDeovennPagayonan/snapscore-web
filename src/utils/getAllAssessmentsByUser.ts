export type Assessment = {
  id: string;
  title: string;
  type: "essay" | "identification";
};

export async function getAllAssessmentsByUser(userId: string): Promise<Assessment[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const response = await fetch(`${baseUrl}/assessments/user/${userId}`);

    console.log("response", response);
    
    if (!response.ok) {
      throw new Error("Failed to fetch assessments");
    }

    const data: Assessment[] = await response.json();
    
    return data;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
}
