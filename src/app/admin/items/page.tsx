"use client";

import { DataTable } from "~/app/_components/dataTable";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type ItemType } from "~/types/myTypes";

export default function ItemsPage() {
  const [data, setData] = useState<ItemType[]>([]);

  useEffect(() => {
    fetch("/api/items", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: { items: ItemType[] }) => {
        setData(data.items);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  const columns: ColumnDef<ItemType>[] = [
    {
      header: "#",
      cell: ({ row }) => {
        return <div>{row.index + 1}</div>;
      },
    },
    {
      // accessorKey: "name",
      header: "Item",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className="text-lg">{item.name}</div>
            {/* <div className="text-sm text-gray-500">{item.theme}</div> */}
          </div>
        );
      },
    },
    {
      // accessorKey: "rate",
      header: `Price (₹)`,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className="text-lg">&#8377;{item.price}</div>
            {/* <div className="text-sm text-gray-500">
              &#8377;{item.rate}/min
            </div> */}
          </div>
        );
      },
    },
    // {
    //   header: 'Quantity',
    //   cell: ({ row }) => {
    //     const item = row.original;
    //     return (
    //       <div>
    //         <div className="text-md font-semibold">{item.quantity}</div>
    //       </div>
    //     );
    //   }
    // },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex justify-end">
            <Link
              href={`/admin/items/${item.id}/edit`}
              className="mb-2 me-2 rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={async () => {
                if (confirm("Are you sure you want to delete?")) {
                  fetch("/api/items", {
                    method: "DELETE",
                    headers: {
                      "Cache-Control": "no-cache",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: item.id }),
                  })
                    .then((res) => {
                      if (!res.ok) {
                        throw new Error("Network response was not ok");
                      }
                    })
                    .then(() => {
                      fetch("/api/items", {
                        method: "GET",
                        headers: {
                          "Cache-Control": "no-cache",
                          "Content-Type": "application/json",
                        },
                      })
                        .then((res) => res.json())
                        .then((data: { items: ItemType[] }) => {
                          setData(data.items);
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
          href={"/admin/items/add"}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
        >
          Add Item
        </Link>
      </div>
    </div>
  );
}
