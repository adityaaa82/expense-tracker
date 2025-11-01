export interface transactionType {
    _id: string;
    amount: number;
    description: string;
    date: string;
    type: string;
    category: string;
}

export interface transactionFilterType {
    type:string;
    category: string;
    startDate: string;
    endDate: string;
}