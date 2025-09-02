"use client";

import { useState } from "react";

import { BillType, TableType } from "@/types/myTypes";
import { universalFetcher } from "@/utils/fetches";
import useSWR, { useSWRConfig } from "swr";

import Bill from "./_components/billModal";
import Unset from "./_components/unsetModal";
import { toast } from "react-hot-toast";

export default function FoodBill({ table }: { table: TableType }) {
  const { mutate } = useSWRConfig();

  const { data, isLoading } = useSWR(`/api/items`, async (url) => {
    const data = await universalFetcher(url, "GET");
    return data;
  });

  const { data: unsettledData } = useSWR(`/api/bills/canteen/unsettled`, async (url) => {
    const data = await universalFetcher(url, "GET");
    return data;
  });

  const [bill, setBill] = useState<BillType>();
  const [showUnsettled, setShowUnsettled] = useState<boolean>(false);

  return (
    <div className="relative">
      {isLoading && (
        <div className="relative m-3 flex h-[268px] w-[350px] items-center justify-center">
          <div className="h-[168px] w-[250px] rounded-3xl bg-[#FFCC33]">
            <div className="flex flex-col pt-5">
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-grow justify-center">
                  <div className="flex flex-col">
                    <span className="mx-auto text-xl font-bold text-black">
                      Canteen
                    </span>
                  </div>
                </div>
              </div>

              <div className="mx-auto my-5 animate-pulse rounded-md bg-white/70 px-10 py-6 text-black shadow-sm hover:bg-white/80">
                Create Bill
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {bill && (
            <Bill
              bill={bill}
              items={data.items}
              table={table}
              close={() => {
                setBill(undefined);
                mutate("/api/bills/canteen/unsettled", undefined, { revalidate: true });
              }}
            />
          )}


          {showUnsettled && (
            <Unset
              bills={unsettledData?.bills || []}
              items={data?.items || []}
              table={{
                id: 0,
                name: "Canteen",
                rate: 0,
                theme: "canteen",
                checked_in_at: null,
                unsettled: unsettledData?.bills || []
              }}
              close={() => {
                setShowUnsettled(false);
              }}
              canteen={true}
            />
          )}

          <div className="relative m-3 flex h-[268px] w-[350px] items-center justify-center">
            <div className="relative h-[168px] w-[250px] rounded-3xl bg-[#FFCC33]">
              {unsettledData?.bills?.length > 0 && (
                <button
                  className="absolute right-2 top-2 rounded-full bg-red-500/90 p-1 px-2"
                  onClick={() => {
                    setShowUnsettled(true);
                  }}
                >
                  {unsettledData.bills.length}
                </button>
              )}
              <div className="flex flex-col pt-5">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-grow justify-center">
                    <div className="flex flex-col">
                      <span className="mx-auto text-xl font-bold text-black">
                        Canteen
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const response = await universalFetcher("/api/bills", "POST", {
                        table: 0, // tableId: 0 for canteen-only bills
                      });
                      if (response.bill) {
                        setBill({
                          ...response.bill,
                          tableMoney: 0,
                          canteenMoney: 0,
                          paymentMode: 'upi',
                          upiPaid: 0,
                          totalAmount: 0,
                          settled: false
                        });
                      }
                    } catch (error) {
                      console.error("Error creating canteen bill:", error);
                    }
                  }}
                  className="mx-auto my-5 rounded-md bg-white/60 px-10 py-6 text-black shadow-sm hover:bg-white/80"
                >
                  Create Bill
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

