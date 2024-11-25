export const ADD_INVENTORY_CARD = "ADD_CARD";
export const UPDATE_INVENTORY_CARD = "UPDATE_CARD";
export const DELETE_INVENTORY_CARD = "DELETE_CARD";
export const SET_INVENTORY_CARDS = "SET_CARDS";

export const addInventoryCard = (card: any) => ({
  type: ADD_INVENTORY_CARD,
  payload: card,
});

export const updateInventoryCard = (card: any) => ({
  type: UPDATE_INVENTORY_CARD,
  payload: card,
});

export const deleteInventoryCard = (cardId: any) => ({
  type: DELETE_INVENTORY_CARD,
  payload: cardId,
});

export const setInventoryCards = (cards: any) => ({
  type: SET_INVENTORY_CARDS,
  payload: cards,
});
