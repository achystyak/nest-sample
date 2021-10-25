export class CreatePocketDto {
    purse: string;
    envelope: string;
    values: [{
        name: string;
        value: number;
    }];
}
