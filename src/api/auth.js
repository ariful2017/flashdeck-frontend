import client from "./client";

export async function registerUser(userData) {
  const response = await client.post("/register/", userData);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await client.post("/login/", credentials);
  return response.data;
}

export async function refreshAccessToken(refresh) {
  const response = await client.post("/token/refresh/", {
    refresh,
  });

  return response.data;
}