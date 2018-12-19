export class Room {
  name: string;
  beamer: boolean;
  capacity: number;
  crowdedness: number;
  type: string;
  occupied: boolean;
  isSelected: boolean;
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
