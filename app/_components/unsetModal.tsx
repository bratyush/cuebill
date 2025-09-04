import { Icons } from "@/components/icons";
import { BillType, ItemType, TableType } from "@/types/myTypes";
import { formatDate, formatElapsed, formatTime } from "@/utils/common";
import { universalFetcher } from "@/utils/fetches";
import { canteenTotalSwr } from "@/utils/hooks";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import Bill from "./billModal";

export default function Unset({
  bills,
  items,
  table,
  close,
  canteen = false,
}: {
  bills: BillType[];
  items: ItemType[];
  table: TableType;
  close: () => void;
  canteen: Boolean;
}) {
  const { mutate } = useSWRConfig();

  if (bills.length === 0) {
    close();
  }

  const [bill, setBill] = useState<BillType | null>(null);
  const [showBill, setShowBill] = useState<boolean>(false);

  return (
    <>
      {showBill && bill ? (
        <Bill
          bill={bill}
          items={items}
          table={table}
          close={() => {
            setShowBill(false);
          }}
        />
      ) : (
        <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/70 md:inset-0">
          <div className="relative max-h-full w-full max-w-[800px] p-4">
            {/* <!-- Modal content --> */}
            <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {table.name} - Bills
                </h3>
                <button
                  onClick={() => {
                    close();
                  }}
                  type="button"
                  className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="default-modal"
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* <!-- Modal body --> */}
              <div className="space-y-4 p-4 text-black md:p-5">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          id
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Start Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Time Played
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Table Total
                        </th>
                        <th scope="col" className="py-3">
                          Canteen
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill, index) => (
                        <tr
                          key={index}
                          className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
                        >
                          <BillRow bill={bill} />
                          <td className="flex gap-2 px-2 py-2">
                            <button
                              type="button"
                              className="rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400 dark:focus:ring-yellow-900"
                              onClick={() => {
                                setBill(bill);
                                setShowBill(true);
                              }}
                            >
                              Settle
                            </button>
                            <button
                              className="rounded-lg bg-red-500 px-2.5 py-2.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-400 dark:focus:ring-red-900"
                              onClick={() => {
                                if (bill.checkIn == null) {
                                  toast.error("Bill creation time is unknown; cannot delete.");
                                  return;
                                }
                                const createdAt = new Date(bill.checkIn);
                                const now = new Date();
                                const elapsedMs = now.getTime() - createdAt.getTime();

                                if (elapsedMs > 2 * 60 * 1000) {
                                  toast.error("You can only delete a bill within 2 minutes of creation.");
                                  return;
                                }

                                if (confirm("Sure you want to delete this bill?")) {
                                  console.log('asdf', canteen)
                                  if (canteen) {
                                    mutate(
                                      "/api/bills/canteen/unsettled",
                                      async (data: any) => {
                                        await universalFetcher(`/api/bills/${bill.id}`, "DELETE");
                                        toast.success("Bill deleted successfully");

                                        return {
                                          ...data,
                                          bills: data.bills.filter((bl: BillType) => bl.id !== bill.id)
                                        };
                                      },
                                      {
                                        optimisticData: (data: any) => {
                                          return {
                                            ...data,
                                            bills: data.bills.filter((bl: BillType) => bl.id !== bill.id)
                                          };
                                        },
                                      }
                                    );
                                  } else {
                                    mutate(
                                      "/api/tables",
                                      async (data: any) => {
                                        await universalFetcher(`/api/bills/${bill.id}`, "DELETE");
                                        toast.success("Bill deleted successfully");

                                        return data.map((val: TableType) => {
                                          if (val.id === table.id) {
                                            return {
                                              ...val,
                                              unsettled: val.unsettled.filter((bl) => bl.id !== bill.id),
                                            };
                                          }
                                          return val;
                                        });
                                      },
                                      {
                                        optimisticData: (tableData) => {
                                          return tableData.map((val: TableType) => {
                                            if (val.id === table.id) {
                                              return {
                                                ...val,
                                                unsettled: val.unsettled.filter((bl) => bl.id !== bill.id),
                                              };
                                            }
                                            return val;
                                          });
                                        },
                                      },
                                    );
                                  }
                                }
                              }}
                            >
                              <Icons.bin color="white" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BillRow({ bill }: { bill: BillType }) {

  const {data} = canteenTotalSwr(bill.id?.toString());

  return (
    <>
      <td className="px-6 py-4">{bill.id}</td>
      <td className="px-6 py-4">{formatDate(bill.checkIn)}</td>
      <td className="px-6 py-4">{formatTime(bill.checkIn)}</td>
      <td className="px-6 py-4">{formatElapsed(bill.timePlayed)}</td>
      <td className="px-6 py-4">&#8377;{bill.totalAmount}</td>
      <td className="py-4">&#8377;{data?.total}</td>
    </>
  );
}
