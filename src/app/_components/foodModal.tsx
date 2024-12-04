import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Icons } from "~/components/icons";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { CanteenBillType, ItemType } from "~/types/myTypes";
import { createCanteenBill, deleteCanteenBill, fetcher } from "~/utils/fetches";

export default function Food({
  billId,
  items,
  close,
  save,
}: {
  billId: number;
  items: ItemType[];
  close: () => void;
  save?: (TotalAmount: number) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<ItemType>();
  const [selectedQuant, setSelectedQuant] = useState<number>(1);

  const { data, isLoading, mutate } = useSWR<{
    bills: CanteenBillType[];
  }>(`/api/bills/canteen/${billId?.toString()}`, fetcher);

  const TotalAmount = data?.bills.reduce((total: number, item: CanteenBillType) => total + item.amount, 0)

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-screen w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-800/70 md:inset-0">
      <div className="relative max-h-full w-full max-w-xl p-4">
        {/* <!-- Modal content --> */}
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Canteen Bill
            </h3>
            <button
              onClick={() => {
                if (save) {
                  if (data?.bills.length !== 0) {
                    toast.error("Remove all items first");
                    return;
                  }
                }
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
          <div className="space-y-4 p-4 md:p-5">
            <table className="w-full table-auto border border-slate-300 text-black">
              <thead>
                <tr>
                  <th className="border border-slate-300 px-4 py-2">Food</th>
                  <th className="border border-slate-300 px-4 py-2">Price</th>
                  <th className="border border-slate-300 px-4 py-2">
                    Quantity
                  </th>
                  <th className="border border-slate-300 px-4 py-2">Cost</th>
                </tr>
              </thead>
              <tbody>
                {data?.bills.map((item: CanteenBillType, index: number) => {
                  const itemDetails = items.find(
                    (val) => val.id == item.itemId,
                  );
                  const cost = itemDetails
                    ? itemDetails.price * item.quantity
                    : 0;
                  return (
                    <tr key={index}>
                      <td className="border border-slate-300 px-4 py-2">
                        {itemDetails?.name}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        &#8377;{itemDetails?.price}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-slate-300 px-4 py-2">
                        &#8377;{cost}
                      </td>
                      <td className="border border-slate-300 pl-2 pt-2">
                        <button
                          onClick={() => {
                            if (item.id) {
                              deleteCanteenBill(item.id)
                                .then((dt: { status: string }) => {
                                  console.log(dt);
                                  mutate({
                                    bills: data?.bills.filter(
                                      (el) => el.id !== item.id,
                                    ),
                                  }).catch((err) => console.error(err));
                                })
                                .catch((err) => console.error(err));
                            }
                          }}
                        >
                          <Icons.bin color="red" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                <tr key="add">
                  <td className="border border-slate-300 pl-2">
                    <Select
                      onValueChange={(e) => {
                        setSelectedItem(
                          items.find((el: ItemType) => el.id == parseInt(e)),
                        );
                      }}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Items</SelectLabel>
                          {!isLoading &&
                            items.map((item: ItemType) => {
                              return (
                                <SelectItem
                                  key={item?.id}
                                  value={item?.id ? item?.id?.toString() : ""}
                                >
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="border border-slate-300 pl-2">
                    <div className="flex justify-center">
                      &#8377;{selectedItem?.price}
                    </div>
                  </td>
                  <td className="border border-slate-300 pl-2">
                    <Input
                      value={selectedQuant}
                      className="w-[100px]"
                      type="number"
                      placeholder="quantity"
                      onChange={(e) => {
                        if (e.target.value == "") {
                          setSelectedQuant(0);
                        } else {
                          setSelectedQuant(parseInt(e.target.value));
                        }
                      }}
                    />
                  </td>
                  <td className="border border-slate-300 pl-2">
                    <div className="flex justify-center">
                      &#8377;
                      {selectedItem &&
                        selectedQuant &&
                        selectedQuant * selectedItem.price}
                    </div>
                  </td>
                  <td className="border border-slate-300">
                    <button
                      onClick={() => {
                        if (
                          billId !== undefined &&
                          selectedItem &&
                          selectedQuant
                        ) {
                          createCanteenBill(
                            billId,
                            selectedItem.id,
                            selectedQuant,
                            selectedQuant * selectedItem.price,
                          )
                            .then((dt: { status: string }) => {
                              console.log(dt);
                              mutate({
                                bills: [
                                  ...(data?.bills ?? []),
                                  {
                                    billId: billId,
                                    itemId: selectedItem.id ?? 0,
                                    quantity: selectedQuant,
                                    amount: selectedQuant * selectedItem?.price,
                                  },
                                ],
                              })
                                .then(() => {
                                  setSelectedQuant(0);
                                })
                                .catch((err) => console.error(err));
                            })
                            .catch((error) => {
                              console.error("Fetch error:", error);
                            });
                        } else {
                          console.log(billId);
                          console.log("wrong");
                        }
                      }}
                      type="button"
                      disabled={!!(!selectedItem || !selectedQuant)}
                      className="rounded-lg px-3 py-2 text-center text-sm font-medium text-orange-500 hover:bg-neutral-200 focus:outline-none focus:ring-4 focus:ring-neutral-300"
                    >
                      Add
                    </button>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td className="pl-4 py-1">Total</td>
                  <td className="pl-4 py-1">&#8377;{TotalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* <!-- Modal footer --> */}
          <div className="flex items-center justify-between rounded-b border-t border-gray-200 p-4 dark:border-gray-600 md:p-5">
            <button
              onClick={() => {
                if (save) {
                  if (data?.bills.length !== 0) {
                    toast.error("Remove all items first");
                    return;
                  }
                }
                close();
              }}
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-slate-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (save && TotalAmount) {
                  save(TotalAmount);
                }
                close()
              }}
              type="button"
              className="rounded-lg bg-sky-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
            >
              Save Canteen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
