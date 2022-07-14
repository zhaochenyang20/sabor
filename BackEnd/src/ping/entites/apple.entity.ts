import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/*
 * The Apple Entity is only used to test the database.
 */
@Entity()
export class Apple {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
