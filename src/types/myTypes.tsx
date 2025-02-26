import { themes } from "~/utils/consts";

export type MemberType = {
    id: number;
    name: string;
    number: number;
    balance: number;
}

export type TableType = {
    id: number;
    name: string;
    rate: number;
    theme: typeof themes[number];
    checked_in_at: number | null;
    unsettled: BillType[];
};

export type TransactionType = {
    id: number;
    memberId: number;
    member?: MemberType;
    amount: number;
    paymentMode: 'cash' | 'upi' | 'both';
    createdAt?: number;
}

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
    memberId: string | null;
    member?: MemberType;
};

export interface CanteenBillType {
    id?:number;
    itemId:number;
    item?: ItemType;
    billId:number;
    bill?: BillType;
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