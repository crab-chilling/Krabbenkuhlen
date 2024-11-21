export const selectInventoryCards = (state) => state.inventoryReducer.cards;
export const selectInventoryCardById = (state, cardId) =>
  state.inventoryReducer.cards.find((card) => card.id === cardId);
