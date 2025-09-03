"use client";

import SettleModal from "@/app/_components/settleModal";
import { billColumns } from "@/app/admin/revenue/columns";
import { DataTable } from "@/components/ui/dataTable";
import { BillType, MemberType } from "@/types/myTypes";
import { universalFetcher } from "@/utils/fetches";
import { use, useState } from "react";
import useSWR from "swr";

export default function MemberPage(props: { params: Promise<{ memberId: string }> }) {
  const params = use(props.params);
  const [showSettleModal, setShowSettleModal] = useState(false);

  const filteredColumns = billColumns.filter(
    (column) => "accessorKey" in column && column.accessorKey !== "member"
  );

  const { data: memberData, error: memberError, isLoading: memberLoading, mutate } = useSWR<{ member: MemberType }>(
    `/api/members/${params.memberId}`,
    universalFetcher
  );

  const { data: billsData, error: billsError, isLoading: billsLoading } = useSWR<BillType[]>(
    `/api/members/bills/${params.memberId}`,
    universalFetcher
  );

  if (memberError || billsError) {
    console.error("Error fetching data:", memberError || billsError);
    return <div>Error fetching data</div>;
  }

  return (
    <div className="container mx-auto py-10">
      {memberLoading ? (
        <div>Loading member details...</div>
      ) : (
        memberData && (
          <div className="mb-8 flex justify-between">
            <div className="flex flex-row gap-4">
              <span className="my-auto text-3xl font-semibold">
                {memberData.member.name}
              </span>
              <span className="my-auto text-xl font-light">
                +91 {memberData.member.number}
              </span>
            </div>

            <span className="my-auto text-lg">
              Balance Owed:
              <span className="ml-4 text-2xl font-semibold text-red-500">
                ₹{memberData.member.balance * -1}
              </span>
            </span>

            <button
              className={`mb-2 me-2 rounded-lg px-3 py-2 text-sm font-medium text-white ${
                memberData.member.balance !== 0
                  ? "bg-orange-500 hover:bg-orange-500"
                  : "cursor-not-allowed bg-gray-400"
              }`}
              onClick={() =>
                memberData.member.balance !== 0 && setShowSettleModal(true)
              }
              disabled={memberData.member.balance === 0}
            >
              Settle Balance
            </button>
          </div>
        )
      )}

      {showSettleModal && memberData && (
        <SettleModal
          close={() => setShowSettleModal(false)}
          member={memberData.member}
        />
      )}

      <DataTable
        columns={filteredColumns}
        data={billsData ?? []}
        isLoading={billsLoading}
      />
    </div>
  );
}
