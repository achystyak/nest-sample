export class CreateUserDto {

    constructor(args: any) {
        Object.assign(this, args)
    }

    email: string;
    password: string;
}
