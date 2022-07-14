import { IsString } from 'class-validator';

export class UserChangePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}
