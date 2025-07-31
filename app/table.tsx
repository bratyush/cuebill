"use client";

import { Icons } from "@/components/icons";
import { universalFetcher } from "@/utils/fetches";
import {
  calculateRevenue,
  formatElapsed,
  formatTime,
  tableTheme,
} from "@/utils/formatters";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR, { useSWRConfig } from "swr";
import type { BillType, TableType } from "../types/myTypes";
import Food from "./_components/foodModal";
import Note from "./_components/noteModal";
import Unset from "./_components/unsetModal";

export default function Table({
  tableData,
  table,
}: {
  tableData: TableType[];
  table: TableType;
}) {
  const { mutate } = useSWRConfig();

  // menu items fetch
  const { data } = useSWR(`/api/items`, () =>
    universalFetcher("/api/items", "GET"),
  );

  console.log('adsf', data)

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // Date.now() - table.checked_in_at
  const [generatedRevenue, setGeneratedRevenue] = useState<string>("0.00");

  const [showFood, setShowFood] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [showUnset, setShowUnset] = useState<boolean>(false);

  const cbid = localStorage.getItem("tableBill" + table.id.toString());
  const [currentBillId, setCurrentBillId] = useState<number | null>(
    cbid ? parseInt(cbid) : null,
  );

  const unsettled = table.unsettled;

  const imageUrl = tableTheme(table.theme);

  const { data: cantTotal } = useSWR<{ total: number }>(
    currentBillId
      ? `/api/bills/canteen/total/${currentBillId?.toString()}`
      : null,
    async () =>
      universalFetcher(
        `/api/bills/canteen/total/${currentBillId?.toString()}`,
        "GET",
      ),
    {
      revalidateOnFocus: false,
    },
  );

  function checkIn() {
    const NOW = Date.now();

    const updatedData = tableData.map((t: TableType) => {
      if (t.id === table.id) {
        return { ...t, checked_in_at: NOW };
      } else {
        return t;
      }
    });

    mutate(
      "/api/tables",
      async () => {
        try {
          // await checkInTable(table.id, NOW);
          await universalFetcher("/api/tables/" + table.id, "PATCH", {
            checked_in_at: NOW,
          });

          const data = await universalFetcher("/api/bills", "POST", {
            table: table.id,
          });
          if (data.bill.id) {
            setCurrentBillId(data.bill.id);
            localStorage.setItem(
              "tableBill" + table.id.toString(),
              data.bill.id.toString(),
            );
            // set billId to localstorage
          }

          return updatedData;
        } catch (error) {
          toast.error("Table check in failed");
        }
      },
      {
        optimisticData: updatedData,
      },
    );
  }

  function checkOut() {
    if (elapsedTime < 5 * 1000) {
      toast.error("Minimum time for billing is 5 seconds");
      return;
    }

    if (!currentBillId) {
      toast.error("Bill not created");
      universalFetcher("/api/tables/" + table.id, "PATCH", {
        checked_in_at: null,
      });
      return;
    }
    const tempBill: BillType = {
      id: currentBillId,
      tableId: table.id,
      checkOut: Date.now(),
      timePlayed: elapsedTime,
      tableMoney: parseFloat(generatedRevenue),
      paymentMode: "upi",
      upiPaid: parseFloat(generatedRevenue),
      totalAmount: parseFloat(generatedRevenue),
      settled: false,
      memberId: null,
    };
    if (table.checked_in_at) {
      tempBill.checkIn = table.checked_in_at;
    }

    const updatedData = tableData.map((t: TableType) => {
      if (t.id === table.id) {
        return {
          ...t,
          checked_in_at: null,
          unsettled: [...t.unsettled, tempBill],
        };
      } else {
        return t;
      }
    });

    mutate(
      "/api/tables",
      async () => {
        await universalFetcher("/api/tables/" + table.id, "PATCH", {
          checked_in_at: null,
        });
        await universalFetcher(
          "/api/bills/" + currentBillId,
          "PATCH",
          tempBill,
        );
        // delete from localStorage
        localStorage.removeItem("tableBill" + table.id.toString());
        toast.success("Bill Saved");
        return updatedData;
      },
      {
        revalidate: false,
        optimisticData: updatedData,
      },
    );
  }

  useEffect(() => {
    let theTimer: NodeJS.Timeout;

    if (table.checked_in_at) {
      theTimer = setInterval(() => {
        if (table.checked_in_at) {
          setElapsedTime(Date.now() - table.checked_in_at);
          const et = Date.now() - table.checked_in_at;
          setGeneratedRevenue(calculateRevenue(table.rate, et));
        }
      }, 1000);
    }

    return () => {
      clearInterval(theTimer);
      setElapsedTime(0);
      setGeneratedRevenue("0.00");
    };
  }, [table.checked_in_at, table.rate]);

  return (
    <>
      {showFood && currentBillId && (
        <Food
          billId={currentBillId}
          items={data.items}
          close={() => {
            mutate(`/api/bills/canteen/total/${currentBillId.toString()}`);
            setShowFood(false);
          }}
        />
      )}
      {showNote && currentBillId && (
        <Note
          billId={currentBillId}
          close={() => {
            setShowNote(false);
          }}
        />
      )}
      {showUnset && (
        <Unset
          bills={unsettled}
          items={data.items}
          table={table}
          close={() => {
            setShowUnset(false);
          }}
        />
      )}

      <div className="relative m-3 h-[268px] w-[350px]">
        <Image src={imageUrl} alt="bg" fill priority className="-z-10" />

        {unsettled?.length > 0 && (
          <button
            className="absolute right-7 top-6 rounded-full bg-red-500/90 p-1 px-2"
            onClick={() => {
              setShowUnset(true);
            }}
          >
            {unsettled?.length}
          </button>
        )}

        {table.checked_in_at && cantTotal && cantTotal.total > 0 && (
          <button
            className="absolute left-7 top-6 rounded-full bg-green-500/80 p-1 px-2"
            onClick={() => {
              setShowFood(true);
            }}
          >
            &#8377;
            {cantTotal.total}
          </button>
        )}

        <div className="flex flex-col pt-5">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-grow justify-center">
              <div className="flex flex-col">
                <span className="mx-auto text-xl font-bold">{table.name}</span>
                <span className="font-">
                  &#8377;{table.rate}/min - &#8377;
                  {Math.round(table.rate * 60)}/hour
                </span>
              </div>
            </div>
          </div>

          {table.checked_in_at ? (
            <div className="flex flex-col justify-evenly">
              <div className="flex justify-center font-medium">
                {formatTime(table.checked_in_at)}
              </div>

              <div className="mx-10 my-1 flex flex-row justify-evenly rounded bg-gray-800/50 py-1">
                <div className="flex flex-col">
                  <span className="mx-auto text-sm font-thin">Time</span>
                  <span className="font-medium">
                    {formatElapsed(elapsedTime)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="mx-auto text-sm font-thin">Money</span>
                  <span className="font-medium">&#8377;{generatedRevenue}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-row px-6">
                <button
                  className="my-1 mr-1 flex w-full basis-1/6 items-center justify-center rounded-md bg-green-400/70 shadow-sm hover:bg-green-400/90"
                  onClick={() => {
                    setShowFood(true);
                  }}
                >
                  <Icons.food />
                </button>
                <button
                  className="my-1 mr-1 flex w-full basis-1/6 items-center justify-center rounded-md bg-orange-400/70 shadow-sm hover:bg-orange-400/90"
                  onClick={() => {
                    setShowNote(true);
                  }}
                >
                  <Icons.note />
                </button>
                <button
                  className="my-1 basis-2/3 rounded-md bg-red-500/70 py-3 shadow-sm hover:bg-red-500/90"
                  onClick={() => {
                    checkOut();
                  }}
                >
                  <span className="font-semibold">Check Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex">
              <button
                className="mx-auto my-5 rounded-md bg-white/20 px-10 py-6 shadow-sm hover:bg-white/30"
                onClick={() => {
                  checkIn();
                }}
              >
                Check In
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
