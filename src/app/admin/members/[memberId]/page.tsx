"use client";

import { useEffect, useState } from "react";
import { universalFetcher } from "~/utils/fetches";
import { BillType } from "~/types/myTypes";
import { DataTable } from "~/components/ui/dataTable";
import { billColumns } from "~/app/admin/revenue/columns";
import SettleModal from "~/app/_components/settleModal";
import useSWR from "swr";

export default function MemberPage({
  params,
}: {
  params: { memberId: string };
}) {
  const [member, setMember] = useState<any>(null);
  const [bills, setBills] = useState<BillType[]>([]);
  const [showSettleModal, setShowSettleModal] = useState(false);

  const filteredColumns = billColumns.filter(
    (column) => "accessorKey" in column && column.accessorKey !== "member",
  );

  const { data: memberData, error } = useSWR(
    `/api/members/${params.memberId}`,
    universalFetcher,
  );

  useEffect(() => {
    if (memberData) {
      setMember(memberData.member);
    }
  }, [memberData]);

  if (error) {
    console.error("Error fetching member data:", error);
  }

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const billsData = await universalFetcher(
          `/api/members/bills/${params.memberId}`,
          "GET",
        );

        setBills(billsData);
        console.log("billsData", billsData);
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
            <span className="my-auto text-3xl font-semibold">
              {member.name}
            </span>
            <span className="my-auto text-xl font-light">
              +91 {member.number}
            </span>
          </div>

          <span className="my-auto text-lg">
            Balance Owed:
            <span className="ml-4 text-2xl font-semibold text-red-500">
              ₹{member.balance * -1}
            </span>
          </span>

            <button
              className={`mb-2 me-2 rounded-lg px-3 py-2 text-sm font-medium text-white ${member.balance !== 0 ? 'bg-orange-500 hover:bg-orange-500' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={() => member.balance !== 0 && setShowSettleModal(true)}
              disabled={member.balance == 0}
            >
              Settle Balance
            </button>

        </div>
      )}

      {showSettleModal && member && (
        <SettleModal close={() => setShowSettleModal(false)} member={member} />
      )}

      <DataTable columns={filteredColumns} data={bills} />
    </div>
  );
}
