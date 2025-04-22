import { Module } from '@nestjs/common';
import { ParkingController } from './controllers/parking.controller';
import { ParkingService } from './services/parking.service';

@Module({
  imports: [],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class AppModule {}
