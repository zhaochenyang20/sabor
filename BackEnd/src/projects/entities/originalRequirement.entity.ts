import { Project } from './proejct.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { FunctionalRequirement } from './functionalRequirement.entity';

@Entity()
export class OriginalRequirement {
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
        name: 'creator_username',
        nullable: false,
        default: 'unknown',
    })
    creatorUsername: string;

    @ManyToOne(() => Project, (project) => project.originalRequirements)
    project: Project;

    @Column({
        name: 'state',
        nullable: false,
        default: 0,
    })
    // 1~4
    state: number;

    @OneToMany(
        () => FunctionalRequirement,
        (functionalRequirement) => functionalRequirement.originalRequirement,
        { cascade: true },
    )
    functionalRequirements: FunctionalRequirement[];

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
}
