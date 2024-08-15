import { useState } from "react";
import { BillType, TableType } from "~/types/myTypes";
import { formatElapsed, formatTime } from "~/utils/formatters";
import Bill from "./billModal";

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
                          <td className="py-2">
                            <button
                              type="button"
                              className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900"
                              onClick={()=>{
                                setBill(bill);
                                setShowBill(true);
                              }}
                            >
                              Settle
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
