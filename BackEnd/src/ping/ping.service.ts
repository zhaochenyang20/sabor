import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppleDto } from './dto/create-apple.dto';
import { Apple } from './entites/apple.entity';

@Injectable()
export class PingService {
    constructor(
        @InjectRepository(Apple)
        private readonly appleRepository: Repository<Apple>,
    ) {}

    async findAll() {
        return await this.appleRepository.find();
    }

    async create(createAppleDto: CreateAppleDto) {
        const apple = this.appleRepository.create(createAppleDto);
        return await this.appleRepository.save(apple);
    }
}
