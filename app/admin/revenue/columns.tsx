import { Button } from "@/components/ui/button";
import { BillType, CanteenBillType, TransactionType } from "@/types/myTypes";
import { formatElapsed, formatTime } from "@/utils/common";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

export const billColumns: ColumnDef<BillType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          className="w-10"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{bill.id}</div>;
    },
  },
  {
    accessorKey: "table",
    header: "Table",
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{bill.table?.name ?? "Canteen"}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const bill = row.original;
      return bill.checkIn ? (
        <div>{new Date(bill.checkIn).toLocaleDateString('en-GB')}</div>
      ) : (
        <div>Not Checked In</div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{formatTime(bill.checkIn)}</div>;
    },
  },
  {
    accessorKey: "timePlayed",
    header: ({ column }) => {
      return (
        <Button
          className="w-12"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Played
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{formatElapsed(bill.timePlayed)}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => {
      const bill = row.original;

      const endTime = bill.checkIn && bill.timePlayed ? bill.checkIn + bill.timePlayed : bill.checkIn;
      console.log(bill.checkIn, bill.timePlayed);
      console.log(endTime);

      return <div>{formatTime(endTime)}</div>;
    },
  },
  {
    accessorKey: "paymentMode",
    header: "Mode",
    cell: ({ row }) => {
      const bill = row.original;
      return (
        <div>
          {bill.paymentMode == "upi" && "UPI"}
          {bill.paymentMode == "cash" && "Cash"}
          {bill.paymentMode == "both" && "Cash + UPI"}
        </div>
      );
    },
  },
  {
    accessorKey: "tableMoney",
    header: ({ column }) => {
      return (
        <Button
          className="w-20"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Table Money
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>&#8377;{bill.tableMoney}</div>;
    },
  },
  {
    accessorKey: "canteenMoney",
    header: ({ column }) => {
      return (
        <Button
          className="w-20"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Canteen
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>&#8377;{bill.canteenMoney}</div>;
    },
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return (
        <Button
          className="w-20"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>&#8377;{bill.discount}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          className="w-20"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Received
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>&#8377;{bill.totalAmount}</div>;
    },
  },
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => {
      const bill = row.original;

      if (!bill.member) {
        return <div>-</div>;
      } else {
        return <Link href={`/admin/members/${bill.memberId}`} className="hover:underline">{bill.member?.name}</Link>;
      }
    },
  },
];

export const canteenColumns: ColumnDef<CanteenBillType>[] = [
// cratedAt(bill.checkIn),item name, price, quantity, billId, amount,
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          className="w-10"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{bill.id}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const bill = row.original;
      const checkOutDate = bill.bill?.checkOut !== undefined ? bill.bill.checkOut : 0;
      return <div>{new Date(checkOutDate).toDateString()}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const bill = row.original;
      const checkOutDate = bill.bill?.checkOut !== undefined ? bill.bill.checkOut : 0;
      return <div>{formatTime(checkOutDate)}</div>;
    },
  },
  {
    accessorKey: "item",
    header: "Item",
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{bill.item?.name}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const bill = row.original;
      return <div>&#8377;{bill.item?.price}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{bill.quantity}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const bill = row.original;
      return <div>&#8377;{bill.amount}</div>;
    },
  },
  {
    accessorKey: "billId",
    header: "Bill ID",
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{bill.billId}</div>;
    },
  },
];

export const transactionColumns: ColumnDef<TransactionType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          className="w-10"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const transaction = row.original;
      return <div>{transaction.createdAt ? new Date(transaction.createdAt).toDateString() : '-'}</div>;

    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const transaction = row.original;
      return <div>{formatTime(transaction.createdAt)}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const transaction = row.original;
      return <div>&#8377;{transaction.amount}</div>;
    },
  },
  {
    accessorKey: "paymentMode",
    header: "Mode",
    cell: ({ row }) => {
      const transaction = row.original;
      return <div>{transaction.paymentMode}</div>;
    },  
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const transaction = row.original;
      return <div>{transaction.createdAt ? new Date(transaction.createdAt).toDateString() : '-'}</div>;
    },
  },
  {
    accessorKey: "member",
    header: "Member",
    cell: ({ row }) => {
      const transaction = row.original;
      return <div>{transaction.member?.name}</div>;
    },
  },
];
