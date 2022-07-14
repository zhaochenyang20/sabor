import { FunctionalRequirement } from '../../projects/entities/functionalRequirement.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Issue } from './issue.entity';

@Entity()
export class MergeRequest {
    @PrimaryGeneratedColumn()
    sid: number;

    @Column({
        name: 'project',
        nullable: false,
    })
    projectId: number;

    @Column({
        name: 'merge-request-id',
        nullable: false,
    })
    mergeRequestId: number;

    @Column({
        name: 'title',
        nullable: false,
        default: '',
    })
    title: string;

    @Column({
        name: 'desciption',
        nullable: false,
        default: '',
    })
    description: string;

    @ManyToMany(
        () => FunctionalRequirement,
        (functionalRequirement) => functionalRequirement.relatedMergeRequest,
        { cascade: true },
    )
    @JoinTable()
    relatedFunctionalRequirement: FunctionalRequirement[];

    @ManyToMany(() => Issue, (issue) => issue.relatedMergeRequest, {
        onDelete: 'CASCADE',
    })
    @JoinTable()
    relatedIssue: Issue[];

    @Column({
        name: 'assignee',
        nullable: true,
    })
    assignee?: string;
}
