import { isFalsy } from 'utility-types';

export class ValidityCheck {
    static checkUsername(username: string): boolean {
        return !isFalsy(username);
    }

    static checkPassword(password: string): boolean {
        return !isFalsy(password);
    }

    static checkProjectName(projectName: string): boolean {
        return !isFalsy(projectName);
    }

    static checkProjectId(projectId: number): boolean {
        return projectId > 0;
    }

    static checkGeneralName(name: string): boolean {
        return !isFalsy(name);
    }

    static checkGeneralId(id: number): boolean {
        return id > 0;
    }
}
