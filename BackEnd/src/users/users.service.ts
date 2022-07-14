import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './entities/user.entity';
import { encryptPassword, makeSalt } from '../utils/cryptogram';
import { UserFindOneDto } from './dto/user-findOne.dto';
import { JwtService } from '@nestjs/jwt';
import { ValidityCheck } from '../utils/validity-check';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async findAll() {
        const users = await this.userRepository.find();
        return users.map((user) => {
            return {
                id: user.id,
                username: user.username,
            };
        });
    }

    async findOne(userFindOneDto: UserFindOneDto) {
        let user: User;
        if (userFindOneDto.id !== undefined && userFindOneDto.id !== null) {
            user = await this.userRepository.findOne(
                {
                    id: userFindOneDto.id,
                },
                {
                    relations: [
                        'ownProjects',
                        'devProjects',
                        'qaProjects',
                        'sysProjects',
                    ],
                },
            );
        } else {
            if (
                ValidityCheck.checkUsername(userFindOneDto.username) === false
            ) {
                throw new BadRequestException('Username check failed');
            }
            user = await this.userRepository.findOne(
                {
                    username: userFindOneDto.username,
                },
                {
                    relations: [
                        'ownProjects',
                        'devProjects',
                        'qaProjects',
                        'sysProjects',
                    ],
                },
            );
        }
        if (!user) {
            throw new NotFoundException(
                `User ${userFindOneDto.username} not found`,
            );
        }
        return {
            id: user.id,
            username: user.username,
            description: user.description,
            ownProjectIds: user.ownProjects.map((project) => project.id),
            sysProjectIds: user.sysProjects.map((project) => project.id),
            devProjectIds: user.devProjects.map((project) => project.id),
            qaProjectIds: user.qaProjects.map((project) => project.id),
        };
    }

    async register(userRegisterDto: UserRegisterDto) {
        const { username, password } = userRegisterDto;
        if (ValidityCheck.checkUsername(username) === false) {
            throw new BadRequestException('Username check failed');
        }
        if (ValidityCheck.checkPassword(password) === false) {
            throw new BadRequestException('Password check failed');
        }
        const user = await this.userRepository.findOne({ username: username });
        if (user) {
            throw new BadRequestException(
                'The user you were trying to create already exists',
            );
        }
        const salt = makeSalt(); // make secret salt
        const hashPwd = encryptPassword(password, salt); // encryption password
        try {
            const userToSave = this.userRepository.create({
                username: username,
                password: hashPwd,
                salt: salt,
                email: '',
                nickname: '',
                isDeleted: false,
                description: '',
            });
            await this.userRepository.save(userToSave);
            return 'Registration success';
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }

    /**
     * Validate User: use as a helper function of the AuthGuard
     * @param username: `string`
     * @param password: `string` (not encrypted)
     * @returns:
     * if succcess, return user's info (except password related)
     * otherwise, return `null`.
     */
    async validateUser(username: string, password: string) {
        const user = await this.userRepository.findOne({ username: username });

        // check password using encryption algorith,
        if (user && user.password === encryptPassword(password, user.salt)) {
            return {
                id: user.id,
                username: user.username,
            };
        }
        return null;
    }

    /**
     * Login: login user and return login token
     * @param id: `number`
     * @param username: `string`
     * @returns: `string`, the token signed by jwt
     */
    login(id: number, username: string) {
        const payload = { username: username, sub: id };
        return this.jwtService.sign(payload);
    }

    /**
     * changePassword: change password
     * @param user: `string`
     * @param oldPassword: `string`
     * @param newPassword: `string`
     * @returns `string`, the new token
     * @throws UnauthorizedException when old password isn't correct
     * @throws BadRequestException when new password is invalid
     * @throws InternalServerErrorException when something was wrong in database interaction
     */
    async changePassword(
        username: string,
        oldPassword: string,
        newPassword: string,
    ) {
        if ((await this.validateUser(username, oldPassword)) === null) {
            throw new UnauthorizedException('Incorrect old password!');
        }
        if (!ValidityCheck.checkPassword(newPassword)) {
            throw new BadRequestException('Invalid new password!');
        }

        try {
            const user = await this.userRepository.findOneOrFail({
                username: username,
            });
            user.password = encryptPassword(newPassword, user.salt);
            await this.userRepository.save(user);

            // TODO: deactivate previous tokens signed to this user

            const payload = { username: username, sub: user.id };
            return this.jwtService.sign(payload);
        } catch (err) {
            Logger.warn(err);
            throw new InternalServerErrorException('Unknown error!');
        }
    }
}
