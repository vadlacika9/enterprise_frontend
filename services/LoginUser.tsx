import Cookies from 'js-cookie';

export async function loginUser(credentials: Record<string, string>) {
  const response = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

 const data = await response.json();

  if (response.ok && data.token) {
    // Elmentjük a tokent egy 'auth-token' nevű sütibe
    // expires: 7 -> 7 napig érvényes
    // secure: true -> csak HTTPS-en megy (productionben fontos)
    Cookies.set('auth-token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
  }

  return data;
}