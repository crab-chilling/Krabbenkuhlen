export const isUserAuthenticated = (state: any) => state.userReducer.id !== -1;
export const selectUserId = (state: any) => state.userReducer.id;
export const selectUserSurname = (state: any) => state.userReducer.surName;
export const selectUserLastName = (state: any) => state.userReducer.lastName;
export const selectUserAccount = (state: any) => state.userReducer.account;
export const selectUserCardList = (state: any) => state.userReducer.cardList;
