import { Envelope } from 'src/api/envelope/envelope.entity';
import { User } from 'src/api/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('moneyboxes')
export class Moneybox {

    constructor(args: Moneybox) {
        Object.assign(this, args)
        this.factValue = this.envelopes?.length
            ? this.envelopes?.map(e => e.factValue)?.
                reduce((ac, val) => ac + val)
            : 0;
    }

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column({ nullable: true, type: Date })
    expectedDate?: Date;

    @Column()
    name: string;

    @ManyToOne(() => User, { nullable: true })
    user: User;

    @OneToMany(() => Envelope, envelope => envelope.moneybox, { nullable: true })
    envelopes?: Envelope[];

    // Calculated

    factValue?: number;
}
