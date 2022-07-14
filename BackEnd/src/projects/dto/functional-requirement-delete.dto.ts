import { IsInt, IsNumber, Min } from 'class-validator';

export class FunctionalRequirementDeleteDto {
    @IsNumber()
    @IsInt()
    @Min(1)
    id: number;
}
