export type TableType = {
    id: number;
    name: string;
    rate: number;
    theme: 'pool' | 'snooker';
    checkedIn: number;
    time: number;
};

export type BillType = {
    id?: number;
    table?: string;
    tableId:number;
    checkIn?: number;
    checkOut?: number;
    timePlayed?: number;
    tableRate?: number;
    money?: number;
    discount: number;
    mode: 'cash' | 'upi';
    totalAmount?: number;
};