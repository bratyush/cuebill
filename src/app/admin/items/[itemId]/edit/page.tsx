"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { type ItemType } from "~/types/myTypes";
import toast from "react-hot-toast";

export default function EditTable() {
  const [itemName, setItemName] = useState<string>("");
  const [price, setPrice] = useState<number>();

  const router = useRouter();

  const { itemId } = useParams<{ itemId: string }>();

  useEffect(() => {
    if (itemId) {
      fetch("/api/items/" + itemId, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data: { item: ItemType }) => {
          const item: ItemType = data.item;
          console.log("data", item);
          setItemName(item.name);
          setPrice(item.price);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  }, [itemId]);

  function addTableSubmit(itemName: string, price?: number) {
    if (itemId) {
      fetch("/api/items/" + itemId, {
        method: "PATCH",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: itemName, price: price }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          toast.success("Item updated");
          router.push("/admin/items");
        })
        .catch((error) => {
          toast.error("There was an error!");
          console.error("Fetch error:", error);
        });
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTableSubmit(itemName, price);
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
        {/* <div className="mb-5">
          <label
            htmlFor="styles"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Table Style
          </label>
          <select
            onChange={(e) => setStyle(e.target.value)}
            id="styles"
            value={style}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="pool">Pool</option>
            <option value="snooker">Snooker</option>
          </select>
        </div> */}

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
