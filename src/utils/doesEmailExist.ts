const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const doesEmailExist = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/users/exists?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Failed to check email existence:", error);
    return false;
  }
};
