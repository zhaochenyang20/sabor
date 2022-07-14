import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UserFindOneDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsOptional()
    @Min(1)
    @IsInt()
    id?: number;
}
