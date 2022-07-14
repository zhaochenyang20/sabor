import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    @Min(0)
    offset?: number = 0;

    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    @Min(1)
    limit?: number = 20;
}
