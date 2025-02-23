"use client";

import { useState } from "react";
import { Icons } from "~/components/icons";
import { universalFetcher } from "~/utils/fetches";
import toast from "react-hot-toast";
import type { MemberType } from "~/types/myTypes";
import useSWR, { mutate } from "swr";
export default function SettleModal({
  close,
  member,
}: {
  close: () => void;
  member: MemberType;
}) {

  const [mode, setMode] = useState<"cash" | "upi" | "both">("upi");
  const [cashPaid, setCashPaid] = useState<number>(0);
  const [upiPaid, setUpiPaid] = useState<number>(member.balance * -1);
  const [error, setError] = useState<string>("");
  const totalAmount = member.balance * -1;

  async function settleBalance() {
    try {
      await universalFetcher(`/api/members/${member.id}/settle`, "POST", {
        amount: totalAmount,
        paymentMode: mode,
        cashPaid: cashPaid,
        upiPaid: upiPaid,
      });

      toast.success("Balance Settled");
      close();

      mutate(`/api/members/${member.id}`, {
        optimisticData: (data: MemberType) => {
          return {
            ...data,
            balance: 0,
          };
        },
      });

    } catch (error) {
      console.error("Error settling balance:", error);
      toast.error("Failed to settle balance");
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/70 md:inset-0">
      <div className="relative max-h-full w-full max-w-lg p-4">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settle Balance
            </h3>
            <button
              onClick={close}
              className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
            >
              <Icons.close />
            </button>
          </div>

          <div className="space-y-4 p-4 text-black md:p-5">
            <table className="w-full border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <td className="w-40 border border-slate-300 p-2">Member</td>
                  <td className="border border-slate-300 p-2">{member.name}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Due Amount</td>
                  <td className="border border-slate-300 p-2">
                    ₹{totalAmount}
                  </td>
                </tr>

                {/* Mode */}
                <tr>
                  <td className="border border-slate-300 p-2">Mode</td>
                  <td className="flex justify-evenly border-slate-300 p-2">
                    <div className="flex items-center">
                      <input
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMode("cash");
                            setCashPaid(totalAmount);
                            setUpiPaid(0);
                            setError("");
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
                            setCashPaid(0);
                            setUpiPaid(totalAmount);
                            setError("");
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

                {/* Amounts paid */}
                {mode === "both" && (
                  <>
                    <tr>
                      <td className="border border-slate-300 p-2">
                        Cash Amount
                      </td>
                      <td className="border border-slate-300 p-2">
                        <div className="group relative z-0 flex w-full">
                          <span className="my-auto mr-1">&#8377;</span>

                          <input
                            value={cashPaid}
                            onChange={(e) => {
                              let cash = e.target.value;
                              let x = parseFloat(cash);

                              if (Number.isNaN(x)) {
                                setError("Cash amount should be a number");
                                setCashPaid(0);
                              } else if (x + upiPaid > totalAmount) {
                                setError(
                                  "Cash + UPI amount should be less than due amount",
                                );
                              } else if (x < 0) {
                                setError("Cash amount should be positive");
                              } else {
                                setError("");
                              }
                              setCashPaid(x);
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
                    <tr>
                      <td className="border border-slate-300 p-2">
                        UPI Amount
                      </td>
                      <td className="border border-slate-300 p-2 flex">
                        <span className="my-auto mr-1">&#8377;</span>

                        <input
                          value={upiPaid}
                          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 focus:border-slate-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-slate-500"
                          required
                          onChange={(e) => {
                            let upi = e.target.value;
                            let x = parseFloat(upi);

                            if (Number.isNaN(x)) {
                              setError("UPI amount should be a number");
                              setUpiPaid(0);
                            } else if (x + cashPaid > totalAmount) {
                              setError(
                                "UPI + Cash amount should be less than due amount",
                              );
                            } else if (x < 0) {
                              setError("UPI amount should be positive");
                            } else {
                              setError("");
                            }
                            setUpiPaid(x);
                          }}
                          type="number"
                        />
                      </td>
                    </tr>
                  </>
                )}

                {mode === "upi" && (
                  <tr>
                    <td className="border border-slate-300 p-2">UPI Amount</td>
                    <td className="border border-slate-300 p-2 flex">
                      <span className="my-auto mr-1">&#8377;</span>

                      <input
                        value={upiPaid}
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 focus:border-slate-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-slate-500"
                        required
                        onChange={(e) => {
                          let upi = e.target.value;
                          let x = parseFloat(upi);

                          if (Number.isNaN(x)) {
                            setError("UPI amount should be a number");
                          } else if (x > totalAmount) {
                            setError(
                              "UPI amount should be less than due amount",
                            );
                          } else if (x < 0) {
                            setError("UPI amount should be positive");
                          } else {
                            setError("");
                          }
                          setUpiPaid(x);
                        }}
                        type="number"
                      />
                    </td>
                  </tr>
                )}

                {mode === "cash" && (
                  <tr>
                    <td className="border border-slate-300 p-2">Cash Amount</td>
                    <td className="border border-slate-300 p-2 flex">
                      <span className="my-auto mr-1">&#8377;</span>

                      <input
                        value={cashPaid}
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 focus:border-slate-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-slate-500"
                        required
                        onChange={(e) => {
                          let cash = e.target.value;
                          let x = parseFloat(cash);

                          if (Number.isNaN(x)) {
                            setError("Cash amount should be a number");
                          } else if (x > totalAmount) {
                            setError(
                              "Cash amount should be less than due amount",
                            );
                          } else if (x < 0) {
                            setError("Cash amount should be positive");
                          } else {
                            setError("");
                          }
                          setCashPaid(x);
                        }}
                        type="number"
                      />
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="border border-slate-300 p-2">Balance Left</td>
                  <td className="border border-slate-300 p-2">
                    &#8377;{Math.round(totalAmount - (cashPaid ?? 0) - (upiPaid ?? 0))}
                  </td>
                </tr>
              </tbody>
            </table>
            {error ? <div className="text-red-500 h-5">{error}</div> : <div className="h-5"></div>}
          </div>

          <div className="flex items-center justify-between rounded-b border-t border-gray-200 p-4">
            <button
              onClick={close}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              disabled={!!error}
              onClick={settleBalance}
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-600"
            >
              Settle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
