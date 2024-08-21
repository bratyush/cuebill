export type TableType = {
    id: number;
    name: string;
    rate: number;
    theme: 'pool' | 'snooker' | 'violet' | 'amber' | 'red' | 'stone' | 'canteen';
    checked_in_at: number | null;
    unsettled: BillType[];
};

export type BillType = {
    id: number;
    tableId:number;
    table?: TableType;
    checkIn?: number;
    checkOut?: number;
    timePlayed?: number;
    tableMoney: number;
    canteenMoney?: number;
    paymentMode: 'cash' | 'upi' | 'both';
    discount?: number;
    totalAmount: number;
    cashPaid?: number;
    upiPaid: number;
    settled: boolean;
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