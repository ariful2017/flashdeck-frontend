
import client from "./client";

export async function getCards(params = {}) {
  const response = await client.get("/cards/", { params });
  return response.data;
}

export async function getCard(cardId) {
  const response = await client.get(`/cards/${cardId}/`);
  return response.data;
}

export async function createCard(cardData) {
  const response = await client.post("/cards/", cardData);
  return response.data;
}

export async function updateCard(cardId, cardData) {
  const response = await client.patch(
    `/cards/${cardId}/`,
    cardData,
  );
  return response.data;
}

export async function deleteCard(cardId) {
  return client.delete(`/cards/${cardId}/`);
}

export async function reviewCard(cardId, correct) {
  const response = await client.post(
    `/cards/${cardId}/review/`,
    { correct },
  );
  return response.data;
}

export async function getStudyCards(deckId) {
  const response = await client.get("/study/", {
    params: deckId ? { deck: deckId } : {},
  });
  return response.data;
}

export async function getStats() {
  const response = await client.get("/stats/");
  return response.data;
}
