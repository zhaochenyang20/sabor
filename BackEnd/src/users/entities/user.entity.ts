import { Project } from '../../projects/entities/proejct.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'username',
        nullable: false,
        default: 'unknown',
    })
    username: string;

    @Column({
        name: 'password',
        nullable: false,
        default: 'password',
    })
    password: string;

    @Column({
        name: 'salt',
        nullable: false,
        default: '',
    })
    salt: string;

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

    @Column({
        name: 'email',
        nullable: true,
        default: '',
    })
    email: string;

    @Column({
        name: 'nickname',
        nullable: true,
        default: '',
    })
    nickname: string;

    @Column({
        name: 'is_deleted',
        nullable: false,
        default: false,
    })
    isDeleted: boolean;

    @Column({
        name: 'description',
        nullable: true,
        default: '',
    })
    description: string;

    @OneToMany(() => Project, (ownProject) => ownProject.manager)
    ownProjects: Project[];

    @ManyToMany(() => Project, (project) => project.developmentEngineers, {
        cascade: true,
    })
    @JoinTable()
    devProjects: Project[];

    @ManyToMany(() => Project, (project) => project.qualityAssuranceEngineers, {
        cascade: true,
    })
    @JoinTable()
    qaProjects: Project[];

    @ManyToMany(() => Project, (project) => project.systemEngineers, {
        cascade: true,
    })
    @JoinTable()
    sysProjects: Project[];
}
