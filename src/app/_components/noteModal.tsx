import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { BillType } from "~/types/myTypes";
import { patchBill } from "~/utils/fetches";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export default function Note({ tableId, close }: { tableId:string, close: () => void }) {

  const billId = localStorage.getItem('t'+tableId+'bill');

  const { data, isLoading } = useSWR<BillType>(`/api/bills/${billId?.toString()}`, fetcher);

  const [noteText, setNote] = useState<string>();

  const saveNote = (note: string | undefined) => {

    const bill = data;

    if (!note || note === data?.note){
      close();
    } else if (bill) {
      bill.note = note;
      if (billId) {
        patchBill(bill)
          .then((data) => {
            toast.success("Note saved");
            close();
          })
          .catch((error) => {
            toast.error("There was an error!");
            console.error("There was an error!", error);
          });
      }
    }
  }

  return (
    <div className="bg-gray-800/70 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center">
      <div className="relative p-4 w-full max-w-lg max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notes
            </h3>
            <button
              onClick={() => {
                close();
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal">
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
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
          <div className="p-4 md:p-5 space-y-4 text-black">
            {/* <Textarea value={noteText} onChange={(e)=>{setNote(e.target.value)}} placeholder="Enter your note"/> */}
            <textarea defaultValue={data?.note} value={noteText} onChange={(e)=>{setNote(e.target.value)}} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Your Notes"></textarea>
          </div>

          {/* <!-- Modal footer --> */}
          <div className="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={()=>{close();}}
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-slate-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Close
            </button>
            {isLoading ? <div>Loading...</div> : 
              <button
                onClick={()=>{saveNote(noteText)}}
                type="button"
                className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
                Save Note
            </button>
            }

          </div>
        </div>
      </div>
    </div>
  );
}
