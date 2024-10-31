import { Card } from "../types/card";

export const fetchAllCards = async () => {
  const response = await fetch(import.meta.env.VITE_APP_API_URL + `/cards`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("An error occured while fetching data");

  const data = await response.json();
  return data;
};

export const fetchUserCards = async (
  cardList: Array<Number>,
): Promise<Card[]> => {
  if (!cardList || cardList.length === 0) {
    return [];
  }

  const cardFetchPromises = cardList.map(async (id) => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/card/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) throw new Error(`Error fetching card with ID ${id}`);

    return await response.json();
  });

  const cards = await Promise.all(cardFetchPromises); // parallelized calls
  return cards;
};
