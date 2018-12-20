export enum RoomType {
  vergaderzaal,
  bureau,
  klaslokaal,
  aula,
  cafetaria,
  studielandschap,
  onbekend,
}

export class Room {
  id: string;
  name: string;
  type: RoomType;
  beamer: boolean;
  capacity: number;
  crowdedness: number;
  occupied: boolean;
  reservationStart: number;
  reservationDuration: number;
  timeLeft: string;
  dimensions: {
    x: number,
    y: number,
    width: number,
    height: number
  };
}
