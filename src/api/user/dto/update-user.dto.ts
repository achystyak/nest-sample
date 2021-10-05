export class UpdateUserDto {

    constructor(args: any) {
        Object.assign(this, args)
    }

    id: string;
    email: string;
    password: string;
    isActive: boolean;
}
