import { Car } from './car.interface';

export interface ParkingSlot {
  slotNumber: number;
  car?: Car;
  isOccupied: boolean;
}