"use client";

import { useEffect, useState } from "react";
import { universalFetcher } from "~/utils/fetches";
import { BillType } from "~/types/myTypes";
import { DataTable } from "~/components/ui/dataTable";
import { columns } from "~/app/admin/revenue/columns";

export default function MemberPage({
  params,
}: {
  params: { memberId: string };
}) {
  const [member, setMember] = useState<any>(null);
  const [bills, setBills] = useState<BillType[]>([]);

  const filteredColumns = columns.filter(
    (column) => "accessorKey" in column && column.accessorKey !== "member",
  );

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const billsData = await universalFetcher(
          `/api/members/bills/${params.memberId}`,
          "GET",
        );

        setBills(billsData);
        console.log("billsData", billsData);

        const memberData = await universalFetcher(
          `/api/members/${params.memberId}`,
          "GET",
        );

        setMember(memberData.member);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, [params.memberId]);

  return (
    <div className="container mx-auto py-10">
      {member && (
        <div className="mb-8 flex justify-between">
          <div className="flex flex-row gap-4">
            <span className="text-3xl font-semibold my-auto">{member.name}</span>
            <span className="text-xl font-light my-auto">+91 {member.number}</span>
          </div>

            <span className="text-lg my-auto">Balance Owed: 
              <span className="text-2xl font-semibold ml-4 text-red-500">₹{member.balance * -1}</span>
            </span>
          <button
            className="mb-2 me-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-500"
            onClick={() => {
              console.log("Settle Balance");
            }}
          >
            Settle Balance
          </button>
        </div>
      )}

      <DataTable columns={filteredColumns} data={bills} />
    </div>
  );
}
