import { IsInt, IsNumber, Min } from 'class-validator';

export class IterationDeleteDto {
    @Min(1)
    @IsInt()
    @IsNumber()
    id: number;
}
