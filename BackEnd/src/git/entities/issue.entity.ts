import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MergeRequest } from './mergeRequest.entity';

@Entity()
export class Issue {
    @PrimaryGeneratedColumn()
    sid: number;

    @Column({
        name: 'project',
        nullable: false,
    })
    projectId: number;

    @Column({
        name: 'issue-id',
        nullable: false,
    })
    issueId: number;

    @Column({
        name: 'title',
        nullable: false,
        default: '',
    })
    title: string;

    @Column({
        name: 'description',
        nullable: false,
        default: '',
    })
    description: string;

    @Column({
        name: 'state',
        nullable: false,
        default: '',
    })
    state: string;

    @ManyToMany(() => MergeRequest, (mergeRequest) => mergeRequest.relatedIssue)
    relatedMergeRequest: MergeRequest[];

    @Column({
        name: 'closed-by-last-access',
        nullable: false,
        default: new Date(0),
    })
    closeByLastAccess: Date;

    @Column({
        name: 'assignee',
        nullable: true,
    })
    assignee?: string;

    @Column({
        name: 'create-time',
        nullable: true,
    })
    createTime?: Date;

    @Column({
        name: 'close-time',
        nullable: true,
    })
    closeTime?: Date;
}
