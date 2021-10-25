import { Envelope } from 'src/api/envelope/envelope.entity';
import { Expense } from 'src/api/expense/expense.entity';
import { Purse } from 'src/api/purse/purse.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('pockets')
export class Pocket {

    constructor(args: Pocket) {
        Object.assign(this, args);
        this.factValue = this.initialValue - (this.expenses?.map(expense => expense.value)?.
            reduce((ac, val) => ac + val) ?? 0);
    }

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column()
    name: string;

    @Column({ type: 'real' })
    initialValue: number;

    @ManyToOne(() => Purse, { nullable: true })
    purse: Purse;

    @ManyToOne(() => Envelope, envelope => envelope.pockets, { nullable: true })
    envelope: Envelope;

    @OneToMany(() => Expense, expense => expense.envelope, { nullable: true })
    expenses?: Expense[];

    // Calculated
    factValue?: number;
}
