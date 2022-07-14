import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FunctionalRequirementCreateDto {
    @IsOptional()
    @Min(1)
    @IsInt()
    id?: number;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @Min(1)
    @Max(3)
    @IsInt()
    state?: number;

    @IsOptional()
    @Min(0)
    @IsInt()
    developerId?: number;

    @IsOptional()
    @Min(1)
    @IsInt()
    originalRequirementId?: number;

    @IsOptional()
    @Min(0)
    @IsInt()
    systemServiceId?: number;

    @IsOptional()
    @Min(0)
    @IsInt()
    iterationId?: number;
}
