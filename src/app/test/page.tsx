"use client";

import toast from "react-hot-toast";
import useSWR from "swr";
import { ItemType } from "~/types/myTypes";
import { addItem, editItem, getItems } from "~/utils/fetches";

export default function Asdf() {
  const { data, mutate } = useSWR<{ items: ItemType[] }>(
    "/api/items",
    getItems,
    {
      onSuccess: (data) => {
        console.log(data)
        toast.success("Items fetched");
      },
    },
  );

  return (
    <div className="flex flex-col justify-between">
      <p>asdf</p>

      {data?.items &&
        data.items.map((item: any) => (
          <div key={item.id}>
            <p>{item.name}</p>
            <p>{item.price}</p>
          </div>
        ))}

      <button
        onClick={() => {
          if (data) {
            mutate(
              addItem({ itemName: "kaju", price: 12 }).then(() => getItems()),
              {
                optimisticData: {
                  items: [...data.items, { id: 1, name: "kaju", price: 12 }],
                },
                rollbackOnError: true,
                populateCache: true,
                revalidate: false,
              },
            )
              .then(() => {
                toast.success("Kaju added");
              })
              .catch((error) => {
                toast.error("Kaju add failed");
                console.error("Fetch error:", error);
              });
          }
        }}
      >
        Add Kaju
      </button>
      <button
        onClick={() => {
          if (data) {
      
            const updatedData = {
              items: data.items.map((val) => (val.id === 64 ? {
                ...val,
                price: val.price+1,
              } : val)),
            };

            const cur = updatedData.items.find((a) => a.id === 64)

            if (!cur) {return;}

            mutate(
              editItem(64, { name: cur.name, price: cur.price }).then(() => updatedData),
              {
                optimisticData: updatedData,
                // revalidate: false,
              }
            );
          }
        }}
      >
        Edit Kaju
      </button>
    </div>
  );
}
