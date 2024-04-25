"use client"

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "~/app/_components/dataTable";
import { BillType } from "~/types/myTypes";
import { formatElapsed, formatTime } from "~/utils/formatters";

export default function Revenue () {
  const [data, setData] = useState<BillType[]>([]);

  useEffect(() => {

    fetch('/api/bills', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res=>res.json())
    .then((data) => {
      console.log('data', data.bills)
      setData(data.bills);
    });

  }, []);

  const columns: ColumnDef<BillType>[] = [
    {
      accessorKey: "id",
      header: '#',
    },
    {
      header: 'Table',
      cell: ({ row }) => {
        const bill = row.original;
        return <div>{bill.table?.name}</div>
      }
    },
    {
      header: 'rate',
      cell: ({ row }) => {
        const bill = row.original;
        return <div>&#8377;{bill.table?.rate}/min</div>;
      }
    },
    {
      header: 'Date',
      cell: ({ row }) => {
        const bill = row.original;
        return bill.check_in ? <div>{new Date(bill.check_in).toDateString()}</div> : <div>Not Checked In</div>;
      }
    },
    {
      header: 'Start Time',
      cell: ({ row }) => {
        const bill = row.original;
        return <div>{formatTime(bill.check_in)}</div>;
      }
    },
    // {
    //   header: 'End Time',
    //   cell: ({ row }) => {
    //     const bill = row.original;
    //     return <div>{formatTime(bill.checkOut)}</div>;
    //   }
    // },
    {
      header: 'Time Played',
      cell: ({ row }) => {
        const bill = row.original;
        return <div>{formatElapsed(bill.time_played)}</div>;
      }
    },
    {
      header: 'Total Revenue',
      cell: ({ row }) => {
        const bill = row.original;
        return <div>&#8377;{bill.total_amount}</div>;
      }
    },
    {
      header: 'Payment Mode',
      cell: ({ row }) => {
        const bill = row.original;
        return <div>{bill.payment_mode == 'upi' ? 'UPI' : 'Cash'}</div>;
      }
    }
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

  return (
    <div className="container mx-auto py-10">
      <div className="bg-slate-100 rounded-md">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}