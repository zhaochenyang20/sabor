import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import isURL from 'validator/lib/isURL';

/**
 * Custom Validator for special URL check;
 * isURL or empty
 */

@ValidatorConstraint({ name: 'isUrlOrEmpty', async: false })
class IsUrlOrEmpty implements ValidatorConstraintInterface {
    validate(text: string) {
        if (typeof text !== 'string') return false;
        if (text === '') return true;
        return isURL(text, {
            protocols: ['http', 'https'],
            require_protocol: true,
            require_valid_protocol: true,
        });
    }

    defaultMessage() {
        return 'url must be a valid URL (including http/https), or empty';
    }
}

export class SetGitlabInfoDto {
    @Validate(IsUrlOrEmpty)
    @IsString()
    url: string;

    @IsInt()
    @IsNumber()
    id: number;

    @IsString()
    token: string;

    @IsString()
    @IsOptional()
    issueTag?: string;
}
