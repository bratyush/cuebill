"use client";

import { useState } from "react";
import { getItems, settleCanteenBill } from "~/utils/fetches";
import useSWR from "swr";
import { BillType, TableType } from "~/types/myTypes";

import Food from "./_components/foodModal";
import Bill from "./_components/billModal";


export default function FoodBill({ table }: { table: TableType }) {
  const [showFood, setShowFood] = useState<boolean>(false);
  const { data, isLoading } = useSWR(`/api/items`, getItems);

  const [bill, setBill] = useState<BillType>();

  return (
    <div className="relative">
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <>
          {bill && (
            <Bill
              bill={bill}
              items={data.items}
              table={table}
              close={() => {
                setBill(undefined);
              }}
            />
          )}

          {showFood && (
            <Food
              billId={-1}
              items={data.items}
              close={() => {
                setShowFood(false);
              }}
              save={(TotalAmount: number) => {
                settleCanteenBill({
                  tableId: 0,
                  checkIn: Date.now(),
                  checkOut: Date.now(),
                  timePlayed: 0,
                  tableMoney: 0,
                  canteenMoney: TotalAmount,
                  settled: false,
                }).then((newBill) => {
                  setBill(newBill);
                });
              }}
            />
          )}

          {/* {unsettled.length > 0 && (
            <button
              className="absolute right-7 top-6 rounded-full bg-red-500/90 p-1 px-2"
              onClick={() => {
                setShowUnset(true);
              }}
            >
              {unsettled.length}
            </button>
          )} */}

          <div className="flex items-center justify-center relative m-3 h-[268px] w-[350px]">
            <div className="rounded-3xl h-[168px] w-[250px] bg-[#ACBDBA]">
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
                  onClick={() => {
                    setShowFood(true);
                  }}
                  className="mx-auto my-5 rounded-md bg-white/70 px-10 py-6 text-black shadow-sm hover:bg-white/90"
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
