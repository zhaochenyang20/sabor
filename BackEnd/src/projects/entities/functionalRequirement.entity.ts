import { MergeRequest } from '../../git/entities/mergeRequest.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { Iteration } from './iteration.entity';
import { OriginalRequirement } from './originalRequirement.entity';
import { SystemService } from './systemService.entity';

@Entity()
export class FunctionalRequirement {
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

    @ManyToOne(
        () => OriginalRequirement,
        (originalRequirement) => originalRequirement.functionalRequirements,
    )
    originalRequirement: OriginalRequirement;

    @Column({
        name: 'distributor_id',
        nullable: false,
        default: 0,
    })
    // user id
    distributorId: number;

    @Column({
        name: 'developer_id',
        nullable: false,
        default: 0,
    })
    // user id
    developerId: number;

    @Column({
        name: 'project_id',
        nullable: false,
        default: 0,
    })
    projectId: number;

    @ManyToOne(
        () => SystemService,
        (systemService) => systemService.functionalRequirements,
    )
    systemService: SystemService;

    @ManyToOne(() => Iteration, (iter) => iter.functionalRequirements)
    deliveryIteration: Iteration;

    @Column({
        name: 'is_deleted',
        nullable: false,
        default: false,
    })
    isDeleted: boolean;

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

    @ManyToMany(
        () => MergeRequest,
        (mergeRequest) => mergeRequest.relatedFunctionalRequirement,
    )
    relatedMergeRequest: MergeRequest[];
}
