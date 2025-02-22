import useSWR from "swr";
import { getCanteenTotal } from "~/utils/fetches";

export function canteenTotalSwr(billId: string) {
  const { data, isLoading } = useSWR<{ total: number }>(
    `/api/bills/canteen/total/${billId}`,
    async () => getCanteenTotal(billId),
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading };
}