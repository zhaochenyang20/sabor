import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class IterationCreateDto {
    @IsOptional()
    @Min(1)
    @IsInt()
    id?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Max(10000000000000)
    @Min(0)
    @IsInt()
    deadline?: number;

    @IsOptional()
    @IsString()
    directorUsername?: string;

    @Max(4)
    @Min(1)
    @IsInt()
    @IsOptional()
    state?: number;
}
