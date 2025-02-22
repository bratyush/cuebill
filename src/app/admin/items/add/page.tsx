"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { universalFetcher } from "~/utils/fetches";

export default function AddItem() {
  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const router = useRouter();

  async function addItemSubmit(itemName: string, price: number) {
    try {
      await universalFetcher("/api/items", "POST", { itemName, price });
      toast.success("Item added");
      router.push("/admin/items");
    } catch (error) {
      toast.error("There was an error!");
      console.error("Fetch error:", error);
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItemSubmit(itemName, price);
        }}
        className="mx-auto max-w-md"
      >
        <div className="tex my-5 text-2xl font-semibold">
          Add Item to Inventory
        </div>

        <div className="mb-5">
          <label
            htmlFor="itemName"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Item Name
          </label>
          <input
            type="itemName"
            id="itemName"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Price (&#8377;)
          </label>
          <input
            type="number"
            id="price"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
            value={price}
            onChange={(e) => {
              setPrice(parseFloat(e.target.value));
            }}
          />
        </div>

        <div className="mb-6 flex justify-end">
          <div className="p-3">
            <button
              type="submit"
              className="w-auto rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
