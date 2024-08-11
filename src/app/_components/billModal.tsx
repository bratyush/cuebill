import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "~/components/icons";
import type { BillType, TableType } from "~/types/myTypes";
import { checkOutTable, getCanteenTotal, patchBill } from "~/utils/fetches";
import { formatElapsed, formatTime } from "~/utils/formatters";
import useSWR, { useSWRConfig } from "swr";

export default function Bill({
  close,
  bill,
  table,
  showFood,
}: {
  close: () => void;
  bill: BillType | null;
  table: TableType;
  showFood: () => void;
}) {
  const { mutate } = useSWRConfig();

  const billId = localStorage.getItem("t" + table.id.toString() + "bill");

  const { data } = useSWR<{ total: number }>(
    `/api/bills/canteen/total/${billId?.toString()}`,
    async () => getCanteenTotal(billId?.toString()),
  );

  const canteenTotal = data?.total ?? 0;

  const [mode, setMode] = useState<"cash" | "upi" | "both">("upi");
  const [cashPaid, setCashPaid] = useState<number>(0);

  const [error, setError] = useState<string>();

  function saveBill(bill: BillType) {
    mutate(
      "/api/tables",
      patchBill(bill)
        .then(() => {
          close();
          checkOutTable(bill.tableId)
            .then(() => {
              toast.success("Bill settled");
            })
            .catch((error) => {
              toast.error("Table check out failed");
              console.error("Fetch error:", error);
            });
        })
        .catch((error) => {
          toast.error("Table check out failed");
          console.error("Fetch error:", error);
        }),
      { optimisticData: (tableData) => {
          // find the table from tableData.tables and update it to checked_in_at = Date.now()
          console.log(tableData);
          const updatedTable = tableData.tables.find(
            (t: TableType) => t.id === bill.tableId,
          );
          if (updatedTable) {
            updatedTable.checked_in_at = null;
          }
          return { tables: tableData.tables };
        }},
    )
      .then(() => {
        console.log("Table checked out");
        localStorage.removeItem("t" + bill.tableId.toString() + "bill");
      })
      .catch((error) => {
        toast.error("Table check out failed");
        console.error("Fetch error:", error);
      });
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/70 md:inset-0">
      <div className="relative max-h-full w-full max-w-lg p-4">
        {/* <!-- Modal content --> */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bill
            </h3>
            <button
              onClick={() => {
                close();
              }}
              type="button"
              className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
            >
              <Icons.close />
              {/* <span className="sr-only">Close modal</span> */}
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="space-y-4 p-4 text-black md:p-5">
            <table className="w-full border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2">Bill No.</td>
                  <td className="border border-slate-300 p-2">{bill?.id}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Table</td>
                  <td className="border border-slate-300 p-2">{table?.name}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Check In</td>
                  <td className="border border-slate-300 p-2">
                    {formatTime(bill?.checkIn)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Check Out</td>
                  <td className="border border-slate-300 p-2">
                    {formatTime(bill?.checkOut)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Time Played</td>
                  <td className="border border-slate-300 p-2">
                    {formatElapsed(bill?.timePlayed)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Table Rate</td>
                  <td className="border border-slate-300 p-2">
                    &#8377;{table?.rate}/min
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Table Money</td>
                  <td className="border border-slate-300 p-2">
                    &#8377;{bill?.tableMoney}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Canteen Money</td>
                  <td className="border border-slate-300 p-2">
                    <div className="flex flex-row justify-between">
                      &#8377;{canteenTotal}
                      <button
                        className="mr-1 flex w-full basis-1/6 items-center justify-center rounded-md bg-green-400/70 py-1 shadow-sm hover:bg-green-400/90"
                        onClick={() => {
                          showFood();
                        }}
                      >
                        <Icons.food />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* <tr>
                  <td className="border border-slate-300 p-2">Discount</td>
                  <td className="border border-slate-300 p-2">
                    <div className="relative z-0 w-full group">
                      <input
                        value={discount}
                        onChange={(e)=>{setDiscount(Number(e.target.value))}}
                        type="text"
                        name="floating_password"
                        id="floating_password"
                        className="block py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-slate-500 focus:outline-none focus:ring-0 focus:border-slate-600 peer"
                        required
                      />
                    </div>
                  </td>
                </tr> */}
                <tr>
                  <td className="border border-slate-300 p-2">Mode</td>
                  <td className="flex justify-evenly border-slate-300 p-2">
                    <div className="flex items-center">
                      <input
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMode("cash");
                          }
                        }}
                        id="default-radio-1"
                        type="radio"
                        value=""
                        name="default-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      ></input>
                      <label
                        htmlFor="default-radio-1"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Cash
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        defaultChecked={true}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMode("upi");
                          }
                        }}
                        id="default-radio-2"
                        type="radio"
                        value=""
                        name="default-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      ></input>
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        UPI
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMode("both");
                          }
                        }}
                        id="default-radio-2"
                        type="radio"
                        value=""
                        name="default-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      ></input>
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        UPI + Cash
                      </label>
                    </div>
                  </td>
                </tr>
                {mode === "both" && (
                  <tr>
                    <td className="border border-slate-300 p-2">Cash Amount</td>
                    <td className="border border-slate-300 p-2">
                      <div className="group relative z-0 flex w-full">
                        <span className="my-auto mr-1">&#8377;</span>

                        <input
                          value={cashPaid}
                          onChange={(e) => {
                            let cash = e.target.value;
                            setCashPaid(parseFloat(cash));
                          }}
                          type="number"
                          name="floating_password"
                          id="floating_password"
                          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 focus:border-slate-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-slate-500"
                          required
                        />
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="border border-slate-300 p-2">Total Amount</td>
                  <td className="border border-slate-300 p-2">
                    <span className="text-2xl font-semibold text-teal-700">
                      &#8377;
                      {(bill?.tableMoney ?? 0) +
                        (bill?.canteenMoney ?? 0) +
                        canteenTotal}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            {error && <span className="text-red-500">{error}</span>}
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center justify-between rounded-b border-t border-gray-200 p-4 dark:border-gray-600 md:p-5">
            <button
              onClick={() => {
                toast((t) => (
                  <span>
                    Please SETTLE the bill
                    <button
                      className="ml-2 bg-transparent text-gray-400"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      <Icons.close className="h-3 w-3" />
                    </button>
                  </span>
                ));
              }}
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-slate-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Close
            </button>

            <button
              onClick={() => {
                if (bill) {
                  let cash = 0;
                  let upi = 0;
                  if (mode === "upi") {
                    upi = bill.tableMoney;
                  } else if (mode == "cash") {
                    cash = bill.tableMoney;
                  } else if (mode == "both") {
                    if (cashPaid > bill.tableMoney) {
                      setError("Cash amount should be less than total amount");
                      return;
                    }
                    cash = cashPaid;
                    upi = bill.tableMoney - cashPaid;
                  }
                  saveBill({
                    id: bill.id,
                    tableId: bill ? bill.tableId : 0,
                    checkIn: bill.checkIn,
                    checkOut: bill.checkOut,
                    timePlayed: bill.timePlayed,
                    tableMoney: bill.tableMoney,
                    canteenMoney: canteenTotal,
                    paymentMode: mode,
                    cashPaid: cash,
                    upiPaid: upi,
                    totalAmount:
                      (bill.tableMoney ?? 0) +
                      (bill.canteenMoney ?? 0) +
                      canteenTotal,
                  });
                }
              }}
              type="button"
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            >
              Settle Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
