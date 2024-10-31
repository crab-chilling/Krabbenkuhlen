export const isUserAuthenticated = (state) => state.userReducer.id !== -1;
export const selectUserId = (state) => state.userReducer.id;
export const selectUserSurname = (state) => state.userReducer.surName;
export const selectUserLastName = (state) => state.userReducer.lastName;
export const selectUserAccount = (state) => state.userReducer.account;
export const selectUserCardList = (state) => state.userReducer.cardList;
