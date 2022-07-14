import { IsOptional, IsString } from 'class-validator';

export class SystemServiceCreateAndUpdateDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    newName?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
