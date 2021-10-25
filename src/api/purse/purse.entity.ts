import { Envelope } from 'src/api/envelope/envelope.entity';
import { Expense } from 'src/api/expense/expense.entity';
import { Pocket } from 'src/api/pocket/pocket.entity';
import { User } from 'src/api/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('purses')
export class Purse {

    constructor(args: Purse) {
        Object.assign(this, args);
        this.factValue = this.initialValue -
            (this.envelopes?.length ? this.envelopes?.map(e => e.factValue)?.
                reduce((ac, val) => ac + val) ?? 0 : 0);
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

    @ManyToOne(() => User, { nullable: true })
    user: User;

    @OneToMany(() => Envelope, envelope => envelope.purse, { nullable: true })
    envelopes?: Envelope[];

    @OneToMany(() => Pocket, pocket => pocket.purse, { nullable: true })
    pockets?: Pocket[];

    @OneToMany(() => Expense, expense => expense.purse, { nullable: true })
    expenses?: Expense[];

    // Calculated
    factValue?: number;
}
