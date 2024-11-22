export const selectInventoryCards = (state: any) => state.inventoryReducer.cards;
export const selectInventoryCardById = (state: any, cardId: number) =>
  state.inventoryReducer.cards.find((card: any) => card.id === cardId);
