import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from './users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super();
    }

    /**
     *
     * `validate`: Local Strategy's override,
     * using `userService.validateUser`
     *
     * @param username: `string`
     * @param password: `string`
     * @returns user info returned by `userService.validateUser`
     * @throws UnauthorizedException: if validation failed.
     *
     */
    async validate(username: any, password: any) {
        // inputs are not guarenteed to be `string`s.
        if (typeof username !== 'string' || typeof password !== 'string') {
            throw new BadRequestException(
                'Login failed! Invalid username or password!',
            );
        }

        const user = await this.userService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException(
                'Login failed! Non-exist username or wrong password',
            );
        }
        return user;
    }
}
