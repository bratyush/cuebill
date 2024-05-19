export type TableType = {
    id: number;
    name: string;
    rate: number;
    theme: 'pool' | 'snooker';
    checked_in_at: number;
    time: number;
};

export type BillType = {
    id?: number;
    table_id:number;
    table?: TableType;
    check_in?: number;
    check_out?: number;
    time_played?: number;
    table_rate?: number;
    table_money?: number;
    canteen_money?: number;
    payment_mode: 'cash' | 'upi' | 'both';
    total_amount?: number;
};

export type CanteenBillType = {
    id:number;
    item_id:number;
    bill_id:number;
    quantity:number;
    amount:number;
}

export type ItemType = {
    id : number;
    name: string;
    price: number;
    quantity?: number;
};