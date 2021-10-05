import { Message } from 'src/api/message/entities/message.entity';
import { User } from 'src/api/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';

@Entity('rooms')
export class Room {

    constructor(args: Room) {
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
    title: string

    @ManyToOne(() => User, { nullable: true })
    author: User;

    @OneToMany(() => Message, message => message.room, { nullable: true })
    messages?: Message[];

    @ManyToMany(() => User, user => user.rooms, { nullable: true })
    @JoinTable()
    users: User[];

    public static create(author: User, title: string, users: User[]) {
        return new Room({
            title,
            author,
            users
        })
    }

}
