import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { BillType } from "~/types/myTypes";
import { universalFetcher } from "~/utils/fetches";

export default function Note({
  billId,
  close,
}: {
  billId: number;
  close: () => void;
}) {
  const { data, isLoading } = useSWR<BillType>(
    `/api/bills/${billId.toString()}`,
    async (url: string) => {
      const data = await universalFetcher(url, "GET");
      return data;
    }
  );

  const [noteText, setNote] = useState<string>();

  const saveNote = async (note: string | undefined) => {
    const bill = data;

    if (!note || note === data?.note) {
      close();
    } else if (bill) {
      try {
        bill.note = note;
        await universalFetcher(`/api/bills/${bill.id}`, "PATCH", bill);
        toast.success("Note saved");
        close();
      } catch (error) {
        toast.error("There was an error!");
        console.error("There was an error!", error);
      }
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/70 md:inset-0">
      <div className="relative max-h-full w-full max-w-lg p-4">
        {/* <!-- Modal content --> */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notes
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
            {/* <Textarea value={noteText} onChange={(e)=>{setNote(e.target.value)}} placeholder="Enter your note"/> */}
            <textarea
              defaultValue={data?.note}
              value={noteText}
              onChange={(e) => {
                setNote(e.target.value);
              }}
              id="message"
              rows={4}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Enter Your Notes"
            ></textarea>
          </div>

          {/* <!-- Modal footer --> */}
          <div className="flex items-center justify-between rounded-b border-t border-gray-200 p-4 dark:border-gray-600 md:p-5">
            <button
              onClick={() => {
                close();
              }}
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-slate-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Close
            </button>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <button
                onClick={() => {
                  saveNote(noteText);
                }}
                type="button"
                className="rounded-lg bg-sky-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
              >
                Save Note
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
