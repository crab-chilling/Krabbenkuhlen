export const ADD_INVENTORY_CARD = "ADD_CARD";
export const UPDATE_INVENTORY_CARD = "UPDATE_CARD";
export const DELETE_INVENTORY_CARD = "DELETE_CARD";
export const SET_INVENTORY_CARDS = "SET_CARDS";

export const addInventoryCard = (card) => ({
  type: ADD_INVENTORY_CARD,
  payload: card,
});

export const updateInventoryCard = (card) => ({
  type: UPDATE_INVENTORY_CARD,
  payload: card,
});

export const deleteInventoryCard = (cardId) => ({
  type: DELETE_INVENTORY_CARD,
  payload: cardId,
});

export const setInventoryCards = (cards) => ({
  type: SET_INVENTORY_CARDS,
  payload: cards,
});
