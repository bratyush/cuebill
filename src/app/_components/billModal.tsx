import type { BillType, TableType } from "~/types/myTypes";
import { formatElapsed, formatTime } from "~/utils/formatters";
import { useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "~/components/icons";

export default function Bill({ save, close, bill, table }: { save: (bill: BillType) => void, close: ()=>void, bill: BillType | null, table: TableType|null }) {

  const [mode, setMode] = useState<'cash' | 'upi' | 'both'>('upi');

  return (
    <div className="bg-gray-800/70 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center">
      <div className="relative p-4 w-full max-w-lg max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bill
            </h3>
              <button
                onClick={() => {
                  toast((t) => (
                    <span>
                      Please SETTLE the bill
                      <button className="text-gray-400 bg-transparent ml-2" onClick={() => toast.dismiss(t.id)}>
                        <Icons.close className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                }}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal">
                  <Icons.close />
                {/* <span className="sr-only">Close modal</span> */}
              </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-4 md:p-5 space-y-4">
            <table className="border-collapse border border-slate-300 w-full">
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
                  <td className="border border-slate-300 p-2">{formatTime(bill?.check_in)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Check Out</td>
                  <td className="border border-slate-300 p-2">{formatTime(bill?.check_out)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Time Played</td>
                  <td className="border border-slate-300 p-2">{formatElapsed(bill?.time_played)}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Table Rate</td>
                  <td className="border border-slate-300 p-2">&#8377;{table?.rate}/min</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Money</td>
                  <td className="border border-slate-300 p-2">&#8377;{bill?.table_money}</td>
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
                  <td className="border-slate-300 p-2 flex justify-evenly">
                    
                    <div className="flex items-center">
                        <input onChange={(e)=>{if(e.target.checked){setMode('cash')}}} id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                        <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cash</label>
                    </div>  
                    <div className="flex items-center">
                        <input defaultChecked={true} onChange={(e)=>{if(e.target.checked){setMode('upi')}}} id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                        <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">UPI</label>
                    </div>
                    <div className="flex items-center">
                        <input onChange={(e)=>{if(e.target.checked){setMode('both')}}} id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                        <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">UPI + Cash</label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Total Amount</td>
                  <td className="border border-slate-300 p-2">
                    <span className="text-teal-700 font-semibold text-2xl">&#8377;{(bill?.table_money ?? 0) + (bill?.canteen_money ?? 0)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={()=>{
                toast((t) => (
                  <span>
                    Please SETTLE the bill
                    <button className="text-gray-400 bg-transparent ml-2" onClick={() => toast.dismiss(t.id)}>
                      <Icons.close className="w-3 h-3" />
                    </button>
                  </span>
                ))
              }}
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Close
            </button>

            <button
              onClick={()=>{save({
                id: bill?.id,
                table_id: bill ? bill.table_id : 0,
                check_in: bill?.check_in,
                check_out: bill?.check_out,
                time_played: bill?.time_played,
                table_money: bill?.table_money,
                payment_mode: mode,
                total_amount: (bill?.table_money ?? 0) + (bill?.canteen_money ?? 0),
              });}}
              type="button"
              className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
              Settle Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
