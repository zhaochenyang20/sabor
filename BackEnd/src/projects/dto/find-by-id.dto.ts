import { IsArray, IsInt, Min } from 'class-validator';

export class FindByIdDto {
    @Min(1, { each: true })
    @IsInt({ each: true })
    @IsArray()
    ids: number[];
}
