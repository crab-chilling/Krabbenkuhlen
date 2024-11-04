export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  writtenAt: Date;
  text: string;
}
