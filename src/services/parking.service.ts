import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Car } from '../interfaces/car.interface';
import { ParkingSlot } from '../interfaces/parking-slot.interface';

@Injectable()
export class ParkingService {
  private parkingSlots: ParkingSlot[] = [];

  initializeParkingLot(numberOfSlots: number): number {
    if (numberOfSlots <= 0) {
      throw new BadRequestException('Number of slots must be greater than 0');
    }

    this.parkingSlots = Array(numberOfSlots)
      .fill(null)
      .map((_, index) => ({
        slotNumber: index + 1,
        isOccupied: false,
      }));

    return this.parkingSlots.length;
  }

  expandParkingLot(incrementSlots: number): number {
    if (incrementSlots <= 0) {
      throw new BadRequestException('Increment slots must be greater than 0');
    }

    const currentSize = this.parkingSlots.length;
    const newSlots = Array(incrementSlots)
      .fill(null)
      .map((_, index) => ({
        slotNumber: currentSize + index + 1,
        isOccupied: false,
      }));

    this.parkingSlots = [...this.parkingSlots, ...newSlots];
    return this.parkingSlots.length;
  }

  parkCar(car: Car): number {
    const availableSlot = this.parkingSlots.find(slot => !slot.isOccupied);
    
    if (!availableSlot) {
      throw new BadRequestException('Parking lot is full');
    }

    availableSlot.car = car;
    availableSlot.isOccupied = true;
    return availableSlot.slotNumber;
  }

  clearSlot(slotNumber?: number, registrationNumber?: string): number {
    let slot: ParkingSlot | undefined;

    if (slotNumber) {
      slot = this.parkingSlots.find(s => s.slotNumber === slotNumber);
      if (!slot || !slot.isOccupied) {
        throw new NotFoundException('Slot not found or already empty');
      }
    } else if (registrationNumber) {
      slot = this.parkingSlots.find(
        s => s.car?.registrationNumber === registrationNumber,
      );
      if (!slot) {
        throw new NotFoundException('Car not found in parking lot');
      }
    } else {
      throw new BadRequestException('Either slot number or registration number is required');
    }

    slot.car = undefined;
    slot.isOccupied = false;
    return slot.slotNumber;
  }

  getStatus(): ParkingSlot[] {
    return this.parkingSlots.filter(slot => slot.isOccupied);
  }

  getRegistrationNumbersByColor(color: string): string[] {
    return this.parkingSlots
      .filter(slot => slot.car?.color.toLowerCase() === color.toLowerCase())
      .map(slot => slot.car!.registrationNumber);
  }

  getSlotNumbersByColor(color: string): number[] {
    return this.parkingSlots
      .filter(slot => slot.car?.color.toLowerCase() === color.toLowerCase())
      .map(slot => slot.slotNumber);
  }

  getSlotByRegistrationNumber(registrationNumber: string): number {
    const slot = this.parkingSlots.find(
      slot => slot.car?.registrationNumber === registrationNumber,
    );
    if (!slot) {
      throw new NotFoundException('Car not found in parking lot');
    }
    return slot.slotNumber;
  }
}