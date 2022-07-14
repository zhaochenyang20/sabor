import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserChangePasswordDto } from './dto/user-change-password.dto';
import { UserFindOneDto } from './dto/user-findOne.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserInfo } from './user.decorator';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('find')
    async findAllUsers() {
        return {
            code: 200,
            data: await this.usersService.findAll(),
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('find')
    async findOneUser(@Body() userFindOneDto: UserFindOneDto) {
        return {
            code: 200,
            data: await this.usersService.findOne(userFindOneDto),
        };
    }

    @Post('register')
    async register(@Body() userRegisterDto: UserRegisterDto) {
        return {
            code: 200,
            data: await this.usersService.register(userRegisterDto),
        };
    }

    /**
     * Login Request
     * @param user: UserInfoDto
     * @returns: Login Token
     */
    @UseGuards(AuthGuard('local'))
    @Post('login')
    login(@UserInfo() user: UserInfoDto) {
        return {
            code: 200,
            data: this.usersService.login(user.id, user.username),
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('testLogin')
    testLogin(@UserInfo() user: UserInfoDto) {
        return {
            code: 200,
            data: `Welcome ${user.username}`,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('changePassword')
    async changePassword(
        @UserInfo() user: UserInfoDto,
        @Body() data: UserChangePasswordDto,
    ) {
        return {
            code: 200,
            data: await this.usersService.changePassword(
                user.username,
                data.oldPassword,
                data.newPassword,
            ),
        };
    }
}
