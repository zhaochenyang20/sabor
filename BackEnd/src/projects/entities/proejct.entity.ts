import { User } from '../../users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { SystemService } from './systemService.entity';
import { OriginalRequirement } from './originalRequirement.entity';
import { Iteration } from './iteration.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'name',
        nullable: false,
        default: 'unknown',
    })
    name: string;

    @Column({
        name: 'description',
        nullable: false,
        default: '',
    })
    description: string;

    @Column({
        name: 'state',
        nullable: false,
        default: 0,
    })
    state: number;

    @ManyToOne(() => User, (user) => user.ownProjects)
    manager: User;

    @ManyToMany(() => User, (engineers) => engineers.sysProjects)
    systemEngineers: User[];

    @ManyToMany(() => User, (engineers) => engineers.devProjects)
    developmentEngineers: User[];

    @ManyToMany(() => User, (engineer) => engineer.qaProjects)
    qualityAssuranceEngineers: User[];

    @OneToMany(
        () => OriginalRequirement,
        (originalRequirement) => originalRequirement.project,
        { cascade: true },
    )
    originalRequirements: OriginalRequirement[];

    @OneToMany(() => SystemService, (systemService) => systemService.project, {
        cascade: true,
    })
    systemServices: SystemService[];

    @OneToMany(() => Iteration, (iteration) => iteration.project, {
        cascade: true,
    })
    iterations: Iteration[];

    @CreateDateColumn({
        name: 'create_date',
        nullable: false,
    })
    createDate: Date;

    @UpdateDateColumn({
        name: 'update_date',
        nullable: false,
    })
    updateDate: Date;

    @DeleteDateColumn({
        name: 'delete_date',
        nullable: true,
    })
    deleteDate: Date;

    @VersionColumn({
        name: 'version',
        nullable: false,
        default: 1,
    })
    version: number;

    @Column({
        name: 'is_deleted',
        nullable: false,
        default: false,
    })
    isDeleted: boolean;

    @Column({
        name: 'has_git_repo',
        nullable: false,
        default: false,
    })
    hasGitRepo: boolean;

    // By now we assume that all repos
    // are from GitLab.
    // when we support github,
    // we shall add item such as `isGitLab`
    @Column({
        name: 'gitlab-url',
        nullable: false,
        default: '',
    })
    gitlabUrl: string;

    @Column({
        name: 'gitlab-proj-id',
        nullable: false,
        default: 0,
    })
    gitlabProjId: number;

    @Column({
        name: 'git-access-oken',
        nullable: false,
        default: '',
    })
    gitAccessToken: string;

    @Column({
        name: 'merge-request-last-access',
        nullable: false,
        default: new Date(0),
    })
    mergeRequestLastAccess: Date;

    @Column({
        name: 'issue-last-access',
        nullable: false,
        default: new Date(0),
    })
    issueLastAccess: Date;

    @Column({
        name: 'issue-tag',
        nullable: false,
        default: '',
    })
    gitIssueTag: string;
}
