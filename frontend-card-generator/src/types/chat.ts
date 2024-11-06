export interface Message {
  from: number;
  to: number | null;
  message: string;
  sentAt: Date;
}
