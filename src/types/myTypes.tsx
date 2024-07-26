export type TableType = {
    id: number;
    name: string;
    rate: number;
    theme: 'pool' | 'snooker' | 'violet' | 'amber' | 'red' | 'stone';
    checked_in_at: number;
    time: number;
};

export type BillType = {
    id?: number;
    tableId:number;
    table?: TableType;
    checkIn?: number;
    checkOut?: number;
    timePlayed?: number;
    tableMoney: number;
    canteenMoney?: number;
    paymentMode: 'cash' | 'upi' | 'both';
    cashPaid?: number;
    upiPaid: number;
    totalAmount: number;
    note?: string;
};

export interface CanteenBillType {
    id?:number;
    itemId:number;
    billId:number;
    quantity:number;
    amount:number;
}

export interface ctnBllInt extends CanteenBillType {
    item: ItemType;
    bill: BillType;
  }

export type ItemType = {
    id?: number;
    name: string;
    price: number;
    quantity?: number;
};

declare global {
    interface UserPrivateMetadata {
      org: string;
    }
  }