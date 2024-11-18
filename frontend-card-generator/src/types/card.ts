export interface Card {
  name: string;
  description: string;
  family: string;
  affinity: string;
  imgUrl: string;
  smallImgUrl: string;
  id: number;
  energy: number;
  hp: number;
  defense: number;
  attack: number;
  price: number;
  userId: number | null;
}
