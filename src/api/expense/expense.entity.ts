import { Envelope } from 'src/api/envelope/envelope.entity';
import { Pocket } from 'src/api/pocket/pocket.entity';
import { Purse } from 'src/api/purse/purse.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('expenses')
export class Expense {

    constructor(args: Expense) {
        Object.assign(this, args);
    }

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column({ type: 'real' })
    value: number;

    @Column()
    category: string;

    @ManyToOne(() => Purse, { nullable: true })
    purse: Purse;

    @ManyToOne(() => Envelope, envelope => envelope.expenses, { nullable: true })
    envelope?: Envelope;

    @ManyToOne(() => Pocket, pocket => pocket.expenses, { nullable: true })
    pocket?: Pocket;
}
