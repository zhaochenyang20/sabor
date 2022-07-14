import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';

class ChangeInfo {
    @IsInt({ message: 'frid' })
    functionalRequestId: number;

    // MR is determined by project id (provided in URL) and also MR id.
    @IsInt({ message: 'mrid' })
    mergeRequestId: number;
}

export class AttachMergeRequestDto {
    @ValidateNested({ message: 'addItem' })
    @IsArray()
    @IsOptional()
    @Type(() => ChangeInfo)
    addItem?: ChangeInfo[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ message: 'delItem' })
    @Type(() => ChangeInfo)
    delItem?: ChangeInfo[];
}
