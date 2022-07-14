import { IsInt, IsString } from 'class-validator';

/**
 * UserInfoDto: user info parsed by AuthGuard
 */
export class UserInfoDto {
    @IsInt()
    id: number;

    @IsString()
    username: string;
}
