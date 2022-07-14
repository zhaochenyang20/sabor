import { IsInt, IsNumber, Min } from 'class-validator';

export class OriginalRequirementDeleteDto {
    @IsNumber()
    @IsInt()
    @Min(1)
    id: number;
}
