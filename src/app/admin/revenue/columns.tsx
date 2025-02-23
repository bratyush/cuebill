import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { formatElapsed, formatTime } from "~/utils/formatters";
import { Button } from "~/components/ui/button";
import { BillType, CanteenBillType } from "~/types/myTypes";

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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
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
        <div>{new Date(bill.checkIn).toDateString()}</div>
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
          className="w-20"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time Played
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{formatElapsed(bill.timePlayed)}</div>;
    },
  },
  {
    accessorKey: "paymentMode",
    header: "Payment Mode",
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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

];
