import { IsOptional, IsString } from 'class-validator';

export class ProjectUpdateDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
