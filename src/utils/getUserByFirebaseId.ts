export async function getUserByFirebaseId(firebaseId: string): Promise<User> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/firebase/${firebaseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Error fetching user by Firebase ID:', error);
    throw error;
  }
}