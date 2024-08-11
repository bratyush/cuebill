"use client";

import { DataTable } from "~/components/ui/dataTable";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { type ItemType } from "~/types/myTypes";
import toast from "react-hot-toast";
import { deleteItem, getItems } from "~/utils/fetches";

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
      header: "Item",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className="text-lg">{item.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price (₹)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className="text-lg">&#8377;{item.price}</div>
          </div>
        );
      },
    },
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

                  if (!item.id) {
                    return;
                  }
                  deleteItem(item.id)
                    .then(() => {
                      toast.success("Item deleted");
                      
                      getItems()
                        .then((data: { items: ItemType[] }) => {
                          setData(data.items);
                        })
                        .catch((error) => {
                          toast.error("Item fetch failed");
                        });
                    })
                    .catch((error) => {
                      toast.error("Item delete failed");
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
      <DataTable columns={columns} data={data} />
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
