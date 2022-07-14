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
import { Project } from './proejct.entity';

@Entity()
export class Iteration {
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
        name: 'deadline',
        nullable: false,
    })
    deadline: Date;

    @Column({
        name: 'state',
        nullable: false,
        default: 0,
    })
    state: number;

    @Column({
        name: 'director_username',
        nullable: false,
        default: 'unknown',
    })
    directorUsername: string;

    @OneToMany(() => FunctionalRequirement, (func) => func.deliveryIteration, {
        cascade: true,
    })
    functionalRequirements: FunctionalRequirement[];

    @ManyToOne(() => Project, (project) => project.iterations)
    project: Project;

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
