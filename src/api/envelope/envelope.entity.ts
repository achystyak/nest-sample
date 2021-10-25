import { Expense } from 'src/api/expense/expense.entity';
import { Moneybox } from 'src/api/moneybox/moneybox.entity';
import { Pocket } from 'src/api/pocket/pocket.entity';
import { Purse } from 'src/api/purse/purse.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('envelopes')
export class Envelope {

    constructor(args: Envelope) {
        Object.assign(this, args);

        this.factValue = this.initialValue - (this.expenses?.length
            ? this.expenses.map(expense => expense.value).reduce((ac, val) => ac + val)
            : 0);

        this.pocketInitialValue = (this.pockets?.length
            ? this.pockets.map(pocket => pocket.initialValue).reduce((ac, val) => ac + val)
            : 0);

        this.pocketFactValue = (this.pockets?.length
            ? this.pockets.map(pocket => pocket.factValue).reduce((ac, val) => ac + val)
            : 0);
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

    @ManyToOne(() => Purse, purse => purse.envelopes, { nullable: true })
    purse: Purse;

    @ManyToOne(() => Moneybox, box => box.envelopes, { nullable: true })
    moneybox?: Moneybox;

    @OneToMany(() => Expense, expense => expense.envelope, { nullable: true })
    expenses?: Expense[];

    @OneToMany(() => Pocket, pocket => pocket.envelope, { nullable: true })
    pockets?: Pocket[];

    // Calculated
    pocketInitialValue?: number;

    // Calculated
    pocketFactValue?: number;

    // Calculated
    factValue?: number;
}
