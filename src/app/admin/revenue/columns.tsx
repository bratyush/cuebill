import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatElapsed, formatTime } from "~/utils/formatters";
import { Button } from "~/components/ui/button";
import { BillType } from "~/types/myTypes";

export const columns: ColumnDef<BillType>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    header: "Table",
    cell: ({ row }) => {
      const bill = row.original;
      console.log(bill);
      return <div>{ bill.table?.name ?? "Canteen"}</div>;
    },
  },
  {
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
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time Played
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>{formatElapsed(bill.timePlayed)}</div>;
    },
  },
  {
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
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Table Money
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Canteen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
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
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Received
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const bill = row.original;
      return <div>&#8377;{bill.totalAmount}</div>;
    },
  },

  // {
  //   // accessorKey: "rate",
  //   header: `Rate (₹)`,
  //   cell: ({ row }) => {
  //     const table = row.original;
  //     return (
  //       <div>
  //         <div className="text-md font-semibold">
  //           &#8377;{table.rate * 60}/hour
  //         </div>
  //         <div className="text-sm text-gray-500">
  //           &#8377;{table.rate}/min
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const table = row.original;

  //     return (
  //       <div>
  //         <Link
  //           to={`/admin/tables/${table.id}/edit`}
  //           className="focus:outline-none text-white bg-yellow-500 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2 dark:focus:ring-yellow-900">
  //           Edit
  //         </Link>
  //         {/* <button
  //           type="button"
  //           onClick={async () => {
  //             if (
  //               await confirm('Are you sure you want to delete?')
  //             ) {
  //               deleteTable(table.id).then(() => {
  //                 getTables().then((tables) => {
  //                   setData(tables);
  //                 });
  //               });
  //             }
  //           }}
  //           className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
  //           Delete
  //         </button> */}
  //       </div>
  //     );
  //   },
  // },
];