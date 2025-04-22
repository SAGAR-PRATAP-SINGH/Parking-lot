import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingService],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should initialize parking lot', () => {
    const slots = service.initializeParkingLot(5);
    expect(slots).toBe(5);
  });

  it('should expand parking lot', () => {
    service.initializeParkingLot(5);
    const slots = service.expandParkingLot(3);
    expect(slots).toBe(8);
  });

  it('should park a car', () => {
    service.initializeParkingLot(5);
    const slotNumber = service.parkCar({
      registrationNumber: 'KA-01-HH-1234',
      color: 'white',
    });
    expect(slotNumber).toBe(1);
  });

  it('should throw error when parking lot is full', () => {
    service.initializeParkingLot(1);
    service.parkCar({
      registrationNumber: 'KA-01-HH-1234',
      color: 'white',
    });
    
    expect(() =>
      service.parkCar({
        registrationNumber: 'KA-01-HH-1235',
        color: 'white',
      }),
    ).toThrow(BadRequestException);
  });
});