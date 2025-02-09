export default async function createUser(userData: CreateUserDto) {
  console.log(userData)
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      console.error(response.statusText)
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}