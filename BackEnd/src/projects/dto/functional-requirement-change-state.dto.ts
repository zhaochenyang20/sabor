import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class FunctionalRequirementChangeStateDto {
    @Min(1)
    @IsInt()
    @IsNumber()
    id: number;

    @Max(3)
    @Min(1)
    @IsInt()
    @IsNumber()
    state: number;
}
