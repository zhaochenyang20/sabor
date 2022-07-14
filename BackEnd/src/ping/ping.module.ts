import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apple } from './entites/apple.entity';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';

@Module({
    imports: [TypeOrmModule.forFeature([Apple])],
    controllers: [PingController],
    providers: [PingService],
})
export class PingModule {}
