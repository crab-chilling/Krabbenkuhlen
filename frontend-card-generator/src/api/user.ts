export const login = async (username: string, password: string) => {
  const response = await fetch(import.meta.env.VITE_APP_API_URL + "/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error("Bad credentials");

  const data = await response.json();
  return data;
};

export const register = async (
  lastName: string,
  surName: string,
  username: string,
  email: string,
  password: string,
) => {
  const response = await fetch(import.meta.env.VITE_APP_API_URL + "/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: username,
      email,
      pwd: password,
      lastName,
      surName,
    }),
  });

  const data = await response.json();
  return data;
};

export const fetchUserInfoById = async (id: number) => {
  const response = await fetch(
    import.meta.env.VITE_APP_API_URL + `/user/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error("An error occured while fetching data");

  const data = await response.json();
  return data;
};
