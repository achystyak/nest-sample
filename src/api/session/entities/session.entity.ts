import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity'

@Entity('sessions')
export class UserSession {

    constructor(args?: UserSession) {
        Object.assign(this, args)
    }

    @PrimaryGeneratedColumn()
    id?: string;

    // Common Props

    @CreateDateColumn()
    creationDate?: Date

    @UpdateDateColumn()
    modificationDate?: Date

    @DeleteDateColumn()
    deleteDate?: Date

    // Payload

    @Column({ nullable: true })
    secret?: string

    @Column({ default: false })
    expired?: boolean

    // Relations

    @OneToOne(() => User)
    @JoinColumn()
    user?: User;
}