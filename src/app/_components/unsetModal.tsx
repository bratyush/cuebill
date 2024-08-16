import { useEffect, useState } from "react";
import { BillType, TableType } from "~/types/myTypes";
import { formatElapsed, formatTime } from "~/utils/formatters";
import Bill from "./billModal";
import { Icons } from "~/components/icons";
import { deleteBill } from "~/utils/fetches";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";

export default function Unset({
  bills,
  table,
  showFood,
  close,
}: {
  bills: BillType[];
  table: TableType;
  showFood: () => void;
  close: () => void;
}) {
  const { mutate } = useSWRConfig();

  const [bill, setBill] = useState<BillType | null>(null);
  const [showBill, setShowBill] = useState<boolean>(false);

  return (
    <>
      {showBill ? (
        <Bill
          bill={bill}
          table={table}
          close={() => {
            setShowBill(false);
          }}
          showFood={() => showFood()}
        />
      ) : (
        <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/70 md:inset-0">
          <div className="relative max-h-full w-full max-w-[800px] p-4">
            {/* <!-- Modal content --> */}
            <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
              {/* <!-- Modal header --> */}
              <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {table.name} Unsettled Bills
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
                          Start Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Time Played
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill, index) => (
                        <tr className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800">
                          <td className="px-6 py-4">{bill.id}</td>
                          <td className="px-6 py-4">
                            {formatTime(bill.checkIn)}
                          </td>
                          <td className="px-6 py-4">
                            {formatElapsed(bill.timePlayed)}
                          </td>
                          <td className="px-6 py-4">
                            &#8377;{bill.totalAmount}
                          </td>
                          <td className="flex gap-2 py-2">
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
                                if (
                                  confirm("Sure you want to delete this bill?")
                                ) {
                                  mutate(
                                    "/api/tables",
                                    async (data: any) => {
                                      if (bills.length === 1) {
                                        close();
                                      }

                                      await deleteBill(bill.id).then(()=>{
                                        toast.success('Bill deleted successfully');
                                      })
                                      
                                      return data.map((val:TableType)=>{
                                        if(val.id === table.id){
                                          return {
                                            ...val,
                                            unsettled: val.unsettled.filter((bl) => bl.id !== bill.id),
                                          }
                                        }
                                        return val;
                                      })
                                    },
                                    {
                                      optimisticData: (tableData) => {
                                        return tableData.map((val:TableType)=>{
                                          if(val.id === table.id){
                                            return {
                                              ...val,
                                              unsettled: val.unsettled.filter((bl) => bl.id !== bill.id),
                                            }
                                          }
                                          return val;
                                        })
                                      },
                                    },
                                  );
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
