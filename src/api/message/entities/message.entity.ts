import { Room } from 'src/api/room/entities/room.entity';
import { User } from 'src/api/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';

@Entity('messages')
export class Message {

    constructor(args: Message) {
        Object.assign(this, args)
    }

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @CreateDateColumn()
    createdAt?: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @DeleteDateColumn()
    deletedAt?: Date

    @Column()
    text: string

    @ManyToOne(() => User, { nullable: true })
    user: User;

    @OneToMany(() => Room, room => room.messages, { nullable: true })
    room: Room;
}
