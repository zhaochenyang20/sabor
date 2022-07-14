import { IsString } from 'class-validator';

export class CreateAppleDto {
    @IsString()
    name: string;
}
