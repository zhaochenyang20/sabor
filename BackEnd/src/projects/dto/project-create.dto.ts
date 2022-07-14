import { IsOptional, IsString } from 'class-validator';

export class ProjectCreateDto {
    @IsString()
    projectName: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    managerName: string;
}
