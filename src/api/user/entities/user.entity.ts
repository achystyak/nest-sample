import { Message } from 'src/api/message/entities/message.entity';
import { Room } from 'src/api/room/entities/room.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Entity('users')
export class User {

    constructor(args: User) {
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
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => Room, room => room.users, { nullable: true })
    rooms?: Room[];

    public static create(dto: CreateUserDto) {
        return dto.email?.length && dto.password?.length
            ? new User({
                ...dto,
                isActive: true
            }) : null;
    }

    public static update(entity: User, dto: UpdateUserDto) {
        return new User({
            id: entity?.id,
            email: dto.email ?? entity.email,
            password: dto.password ?? entity.password,
            isActive: dto.isActive != undefined ? dto.isActive : entity.isActive
        })
    }
}