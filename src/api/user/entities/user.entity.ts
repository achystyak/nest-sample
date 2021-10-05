import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
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
    creationDate?: Date

    @UpdateDateColumn()
    modificationDate?: Date

    @DeleteDateColumn()
    deleteDate?: Date

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

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