import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../api/user/user.entity'

@Entity('sessions')
export class UserSession {

    constructor(args?: UserSession) {
        Object.assign(this, args)
    }

    @PrimaryGeneratedColumn()
    id?: string;

    // Common Props

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @DeleteDateColumn()
    deletedAt?: Date

    // Payload

    @Column({ nullable: true })
    secret?: string

    @Column({ default: false })
    expired?: boolean

    // Relations

    @ManyToOne(() => User)
    user?: User;
}