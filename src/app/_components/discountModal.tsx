import { useState } from "react";

export default function Discount({
  close,
  billId,
  amount,
  discount,
  setDiscount,
}: {
  close: () => void;
  billId: number;
  amount: number;
  discount: number|undefined;
  setDiscount: (discount: number) => void;
}) {

  const [disc, setDisc] = useState<string>(discount?.toString() || "0");

  const [error, setError] = useState<string>("");

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/70 md:inset-0">
      <div className="relative max-h-full w-full max-w-lg p-4">
        {/* <!-- Modal content --> */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Discount
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
            <table className="w-full border-collapse border border-slate-300">
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2">Bill No.</td>
                  <td className="border border-slate-300 p-2">{billId}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Total Amount</td>
                  <td className="border border-slate-300 p-2">{amount}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-2 py-1">
                    Discount
                  </td>
                  <td className="border border-slate-300 px-2 py-1">
                    <div className="group relative z-0 flex w-full">
                      <span className="my-auto mr-1">&#8377;</span>

                      <input
                        value={disc}
                        onChange={(e) => {
                          let cash = e.target.value;
                          setDisc(cash);

                          let dichik = parseFloat(cash);
                          if (Number.isNaN(dichik)) {
                            setError("Discount should be a number");
                            return;
                          } else if (dichik > amount) {
                            setError("Discount can't be greater than amount");
                            return;
                          } else {
                            setError("");
                          }
                        }}
                        type="number"
                        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2 text-sm text-gray-900 focus:border-slate-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-slate-500"
                        required
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Total Payable</td>
                  <td className="border border-slate-300 p-2">
                    <span className="text-xl font-semibold text-teal-700">
                      &#8377; {amount - (disc?parseInt(disc):0)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            {error && <span className="text-red-500">{error}</span>}
          </div>

          {/* <!-- Modal footer --> */}
          <div className="flex items-center justify-between rounded-b border-t border-gray-200 p-4 dark:border-gray-600 md:p-5">
            {/* <button
              onClick={() => {
                close();
              }}
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-slate-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Close
            </button> */}
            <div></div>
            <button
              disabled={error !== ""}
              onClick={() => {
                setDiscount(parseInt(disc));
                close();
              }}
              type="button"
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
