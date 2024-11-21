export const fetchMarketCards = async () => {
  const response = await fetch(
    import.meta.env.VITE_APP_API_URL + `/store/cards_to_sell`,
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

export const buyCard = async (
  userId: number,
  cardId: number,
  storeId: number = 0,
) => {
  const response = await fetch(
    import.meta.env.VITE_APP_API_URL + "/store/buy",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        card_id: cardId,
        store_id: storeId,
      }),
    },
  );

  const data = await response.json();
  return data;
};

export const sellCard = async (
  userId: number | null,
  cardId: number,
  storeId: number = 0,
) => {
  const response = await fetch(
    import.meta.env.VITE_APP_API_URL + "/store/sell",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        card_id: cardId,
        store_id: storeId,
      }),
    },
  );

  const data = await response.json();
  return data;
};
