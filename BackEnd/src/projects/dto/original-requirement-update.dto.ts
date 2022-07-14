import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class OriginalRequirementUpdateDto {
    @Min(1)
    @IsInt()
    id: number;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @Max(4)
    @Min(1)
    @IsInt()
    state?: number;
}
