"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";
import { universalFetcher } from "@/utils/fetches";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import useSWR from "swr";
import { type MemberType } from "@/types/myTypes";
import { type ColumnDef } from "@tanstack/react-table";

export default function MembersPage() {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<{ members: MemberType[] }>("/api/members", universalFetcher);

  const columns: ColumnDef<MemberType>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link
          href={`/admin/members/${row.original.id}/`}
          className="hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "number",
      header: "Phone Number",
      cell: ({ row }) => <div>{row.original.number}</div>,
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance Owed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>₹{row.original.balance * -1}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
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
                    await universalFetcher("/api/members/" + member.id, "DELETE");
                    toast.success("Member deleted");
                    mutate();
                  } catch (error) {
                    console.error("Fetch error:", error);
                    toast.error("Failed to delete member");
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

  if (error) return <div>Failed to load</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data?.members ?? []}
        isLoading={isLoading}
      />
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
