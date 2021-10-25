export class CreateExpenseDto {
    category: string;
    value: number;
    purse: string;

    pocket?: string;
    envelope?: string;
}
