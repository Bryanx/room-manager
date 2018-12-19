export class Room {
  id: string;
  name: string;
  beamer: boolean;
  capacity: number;
  crowdedness: number;
  type: string;
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
