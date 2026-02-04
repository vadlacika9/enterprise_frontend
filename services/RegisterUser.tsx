export async function registerUser(userData: Record<string, string>) {
  const response = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  console.log(userData);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Hiba történt a regisztráció során");
  }

  return data;
}