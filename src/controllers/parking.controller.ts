import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ParkingService } from '../services/parking.service';

@Controller()
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('parking_lot')
  initializeParkingLot(@Body() body: { no_of_slot: number }) {
    const totalSlots = this.parkingService.initializeParkingLot(body.no_of_slot);
    return { total_slot: totalSlots };
  }

  @Patch('parking_lot')
  expandParkingLot(@Body() body: { increment_slot: number }) {
    const totalSlots = this.parkingService.expandParkingLot(body.increment_slot);
    return { total_slot: totalSlots };
  }

  @Post('park')
  parkCar(@Body() body: { car_reg_no: string; car_color: string }) {
    const slotNumber = this.parkingService.parkCar({
      registrationNumber: body.car_reg_no,
      color: body.car_color,
    });
    return { allocated_slot_number: slotNumber };
  }

  @Get('registration_numbers/:color')
  getRegistrationNumbersByColor(@Param('color') color: string) {
    return this.parkingService.getRegistrationNumbersByColor(color);
  }

  @Get('slot_numbers/:color')
  getSlotNumbersByColor(@Param('color') color: string) {
    return this.parkingService.getSlotNumbersByColor(color);
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  clearSlot(
    @Body('slot_number') slotNumber?: number,
    @Body('car_registration_no') registrationNumber?: string,
  ) {
    const freedSlot = this.parkingService.clearSlot(slotNumber, registrationNumber);
    return { freed_slot_number: freedSlot };
  }

  @Get('status')
  getStatus() {
    return this.parkingService.getStatus().map(slot => ({
      slot_no: slot.slotNumber,
      registration_no: slot.car!.registrationNumber,
      color: slot.car!.color,
    }));
  }
}