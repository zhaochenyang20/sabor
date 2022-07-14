import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Logger,
    Post,
} from '@nestjs/common';
import { CreateAppleDto } from './dto/create-apple.dto';
import { PingService } from './ping.service';

/*
 * Ping module intends to test communication between frontend and backend
 * to prevent problems such as CORS.
 */
@Controller('api/ping')
export class PingController {
    constructor(private readonly pingService: PingService) {}

    /*
     * getPing
     * URL: /api/ping
     * Method: GET
     * Returns:
     * - code: 200
     * - data: 'Hello from server side!'
     */
    @Get()
    getPing() {
        return {
            code: 200,
            data: 'Hello from server side!',
        };
    }

    /*
     * postPing
     * URL: /api/ping
     * Method: POST
     * Params:
     * - msg: string
     * Returns:
     * If message is 'ping':
     * - code: 200
     * - data: pong
     * Otherwise:
     * - code: 400
     * - data: I can't understand
     */
    @Post()
    postPing(@Body('msg') message: string) {
        Logger.debug(message);
        if (message === 'ping') {
            return {
                code: 200,
                data: 'pong',
            };
        } else {
            throw new BadRequestException("I can't understand.");
        }
    }

    /*
     * getApple
     * URL: /api/ping/apple
     * Method: GET
     * Returns:
     * - Apple: Array<Apple>
     */
    @Get('apple')
    async getApple() {
        return {
            code: 200,
            data: await this.pingService.findAll(),
        };
    }

    /*
     * postApple
     * URL: /api/ping/apple
     * Method: POST
     * Params:
     * - name: string
     * Returns:
     * - id: number
     * - name: string
     */
    @Post('apple')
    async postApple(@Body() createAppleDto: CreateAppleDto) {
        return {
            code: 200,
            data: await this.pingService.create(createAppleDto),
        };
    }
}
