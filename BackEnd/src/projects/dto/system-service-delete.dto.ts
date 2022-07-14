import { IsInt, IsNumber, Min } from 'class-validator';

export class SystemServiceDeleteDto {
    @Min(1)
    @IsInt()
    @IsNumber()
    id: number;
}
