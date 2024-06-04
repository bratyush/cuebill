"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/app/_components/dataTable";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type TableType } from "~/types/myTypes";

export default function TablePage() {
  const [data, setData] = useState<TableType[]>([]);

  useEffect(() => {
    fetch("/api/tables", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: { tables: TableType[] }) => {
        setData(data.tables);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  const columns: ColumnDef<TableType>[] = [
    {
      header: "#",
      cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      // accessorKey: "name",
      header: "Table",
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div>
            <div className="text-lg font-semibold">{table.name}</div>
            <div className="text-sm text-gray-500">{table.theme}</div>
          </div>
        );
      },
    },
    {
      // accessorKey: "rate",
      header: `Rate (₹)`,
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div>
            <div className="text-md font-semibold">
              &#8377;{table.rate * 60}/hour
            </div>
            <div className="text-sm text-gray-500">&#8377;{table.rate}/min</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const table = row.original;

        return (
          <div>
            <Link
              href={`/admin/tables/${table.id}/edit`}
              className="mb-2 me-2 rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={async () => {
                if (confirm("Are you sure you want to delete?")) {
                  fetch("/api/tables", {
                    method: "DELETE",
                    headers: {
                      "Cache-Control": "no-cache",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: table.id }),
                  })
                    .then((res) => {
                      if (!res.ok) {
                        throw new Error("Network response was not ok");
                      }
                    })
                    .then(() => {
                      fetch("/api/tables", {
                        method: "GET",
                        headers: {
                          "Cache-Control": "no-cache",
                          "Content-Type": "application/json",
                        },
                      })
                        .then((res) => res.json())
                        .then((data: { tables: TableType[] }) => {
                          setData(data.tables);
                        })
                        .catch((error) => {
                          console.error("Fetch error:", error);
                        });
                    })
                    .catch((error) => {
                      console.error("Fetch error:", error);
                    });
                }
              }}
              className="mb-2 me-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-md bg-slate-100">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="m-3 flex justify-end">
        <Link
          href={"/admin/tables/add"}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
        >
          Add Table
        </Link>
      </div>
    </div>
  );
}
