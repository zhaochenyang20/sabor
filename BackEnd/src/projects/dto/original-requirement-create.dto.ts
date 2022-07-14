import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class OriginalRequirementCreateDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @Max(4)
    @Min(1)
    @IsInt()
    @IsOptional()
    state?: number;
}
