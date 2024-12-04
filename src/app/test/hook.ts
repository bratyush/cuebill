
import toast from "react-hot-toast";
import useSWR from "swr";
import { ItemType } from "~/types/myTypes";
import { addItem, editItem, getItems } from "~/utils/fetches";

export function swrData() {
  const { data, mutate } = useSWR<{ items: ItemType[] }>(
    "/api/items",
    getItems,
    {
      onSuccess: (data) => {
        console.log(data)
        toast.success("Items fetched");
      }, revalidateOnFocus: false,
    },
  );

  return {
    data,
    mutate,
  }
}