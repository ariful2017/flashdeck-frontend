import client from "./client";

export async function getDecks(params = {}) {
  const response = await client.get("/decks/", { params });
  return response.data;
}

export async function getDeck(deckId) {
  const response = await client.get(`/decks/${deckId}/`);
  return response.data;
}

export async function createDeck(deckData) {
  const response = await client.post("/decks/", deckData);
  return response.data;
}

export async function updateDeck(deckId, deckData) {
  const response = await client.patch(
    `/decks/${deckId}/`,
    deckData,
  );

  return response.data;
}

export async function deleteDeck(deckId) {
  const response = await client.delete(`/decks/${deckId}/`);
  return response.data;
}