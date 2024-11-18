export interface User {
  id: number;
  login: string;
  lastName: string;
  surName: string;
  email: string;
  account: number;
  cardList: Array<number>;
  isConnected?: boolean;
}
