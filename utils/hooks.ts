import { universalFetcher } from "@/utils/fetches";
import useSWR from "swr";

export function canteenTotalSwr(billId: string) {
  const { data, isLoading } = useSWR<{ total: number }>(
    `/api/bills/canteen/total/${billId}`,
    async () => universalFetcher(`/api/bills/canteen/total/${billId}`, "GET"),
    {
      revalidateOnFocus: false,
    }
  );

  return { data, isLoading };
}