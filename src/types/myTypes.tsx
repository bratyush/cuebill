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
    money?: number;
    // discount: number;
    payment_mode: 'cash' | 'upi';
    total_amount?: number;
};