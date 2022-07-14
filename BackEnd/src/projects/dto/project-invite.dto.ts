import { IsArray, IsInt, Max, Min } from 'class-validator';

export class ProjectInviteDto {
    @IsInt()
    invitedUser: number;

    // 1 - systemEngineer
    // 2 - developmentEngineer
    // 3 - QualityAssuranceEngineer
    @Min(1, { each: true })
    @Max(3, { each: true })
    @IsInt({ each: true })
    @IsArray()
    grantedRole: number[];
}
