type CreateUserDto = {
  email: string;
};

export default async function createUser(userData: CreateUserDto) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}