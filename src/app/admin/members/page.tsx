"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/dataTable";
import { universalFetcher } from "~/utils/fetches";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

export default function MembersPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await universalFetcher("/api/members", "GET");
        setData(data.members);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "id",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: { row: any }) => (
        <Link href={`/admin/members/${row.original.id}/`} className="hover:underline">
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "number",
      header: "Phone Number",
      cell: ({ row }: { row: any }) => <div>{row.original.number}</div>,
    },
    {
      accessorKey: "balance",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance Owed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => <div>₹{row.original.balance * -1}</div>,
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const member = row.original;

        return (
          <div>
            <Link
              href={`/admin/members/${member.id}/edit`}
              className="mb-2 me-2 rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-500"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={async () => {
                if (confirm("Are you sure you want to delete?")) {
                  try {
                    await universalFetcher("/api/members", "DELETE", {
                      id: member.id,
                    });
                    toast.success("Member deleted");
                    const data = await universalFetcher("/api/members", "GET");
                    setData(data.members);
                  } catch (error) {
                    console.error("Fetch error:", error);
                  }
                }
              }}
              className="mb-2 me-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
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
          href={"/admin/members/add"}
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-medium text-white hover:bg-blue-800"
        >
          Add Member
        </Link>
      </div>
    </div>
  );
}
