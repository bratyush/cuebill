"use client";

import { useState } from "react";
import useSWR from "swr";
import { TabNavigation, TabNavigationLink } from "~/components/tremor/tabNav";
import { DataTable } from "~/components/ui/dataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ctnBllInt, type BillType, type TransactionType } from "~/types/myTypes";
import { universalFetcher } from "~/utils/fetches";
import Charts from "./charts";
import { billColumns, canteenColumns, transactionColumns } from "./columns";

export default function Revenue() {
  const { data, error, isLoading } = useSWR<{
    bills: BillType[];
    canteen: ctnBllInt[];
  }>(`/api/data`, async (url: string) => {
    const data = await universalFetcher(url, "GET");
    return data;
  });

  const [tab, setTab] = useState<string>("bills");

  const [showCustom, setShowCustom] = useState<boolean>(false);
  const [showOne, setShowOne] = useState<boolean>(false);

  const [timeframe, setTimeframe] = useState<string>("td");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  let filterBills: BillType[] = [];
  let filterCanteen: ctnBllInt[] = [];
  let filterTransactions: TransactionType[] = [];

  if (data) {
    // filter data based on timeframe

    filterBills = data.bills.filter((bill) => {
      if (bill.checkIn) {
        const date = new Date(bill.checkIn);
        const now = new Date();
        if (timeframe == "td") {
          // Added condition for This Day
          return date.toDateString() === now.toDateString();
        } else if (timeframe == "tm") {
          return (
            date.getMonth() == now.getMonth() &&
            date.getFullYear() == now.getFullYear()
          );
        } else if (timeframe == "lm") {
          if (now.getMonth() == 0) {
            return (
              date.getMonth() == 11 &&
              date.getFullYear() == now.getFullYear() - 1
            );
          }
          return (
            date.getMonth() == now.getMonth() - 1 &&
            date.getFullYear() == now.getFullYear()
          );
        } else if (timeframe == "ty") {
          return date.getFullYear() == now.getFullYear();
        } else if (timeframe == "ly") {
          return date.getFullYear() == now.getFullYear() - 1;
        } else if (timeframe == "c") {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return date >= start && date <= end;
        } else if (timeframe == "od") {
          // Added condition for One Day
          const selectedDate = new Date(startDate); // Use startDate for the selected date
          return date.toDateString() === selectedDate.toDateString();
        }

        return true;
      }
    });

    filterCanteen = data.canteen.filter((canteen) => {
      if (canteen.bill?.checkIn) {
        const date = new Date(canteen.bill.checkIn);
        const now = new Date();
        if (timeframe == "td") {
          // Added condition for This Day
          return date.toDateString() === now.toDateString();
        } else if (timeframe == "tm") {
          return (
            date.getMonth() == now.getMonth() &&
            date.getFullYear() == now.getFullYear()
          );
        } else if (timeframe == "lm") {
          if (now.getMonth() == 0) {
            return (
              date.getMonth() == 11 &&
              date.getFullYear() == now.getFullYear() - 1
            );
          }
          return (
            date.getMonth() == now.getMonth() - 1 &&
            date.getFullYear() == now.getFullYear()
          );
        } else if (timeframe == "ty") {
          return date.getFullYear() == now.getFullYear();
        } else if (timeframe == "ly") {
          return date.getFullYear() == now.getFullYear() - 1;
        } else if (timeframe == "c") {
          const start = new Date(startDate);
          const end = new Date(endDate);
          return date >= start && date <= end;
        } else if (timeframe == "od") {
          // Added condition for One Day
          const selectedDate = new Date(startDate); // Use startDate for the selected date
          return date.toDateString() === selectedDate.toDateString();
        }

        return true;
      }
    });
  }

  console.log(filterCanteen);

  return (
    <div className="container mx-auto py-2">
      {error && <div>Error: {error.message}</div>}
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <TabNavigation>
            <TabNavigationLink onClick={() => setTab("charts")} active={tab === "charts"}>
              Charts
            </TabNavigationLink>
            <TabNavigationLink onClick={() => setTab("bills")} active={tab === "bills"}>
              Table Bills
            </TabNavigationLink>
            <TabNavigationLink onClick={() => setTab("canteen")} active={tab === "canteen"}>
              Canteen Bills
            </TabNavigationLink>
            <TabNavigationLink onClick={() => setTab("transactions")} active={tab === "transactions"}>
              Transactions
            </TabNavigationLink>

            <div className="m-2 ml-auto flex flex-row gap-4">
              {showCustom && (
                <div className="flex flex-row rounded-md border border-gray-200 px-2">
                  <p className="my-auto mr-4">from :</p>
                  <input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                  ></input>
                  <p className="mx-4 my-auto">to :</p>
                  <input
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                  ></input>
                </div>
              )}

              {showOne && (
                <div className="flex flex-row rounded-md border border-gray-200 px-2">
                  <p className="my-auto mr-4"></p>
                  <input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                  ></input>
                </div>
              )}

              <Select
                onValueChange={(e) => {
                  if (e === "c") {
                    setShowCustom(true);
                    setShowOne(false);
                    setTimeframe(e);
                    setStartDate("");
                  } else if (e === "od") {
                    setShowOne(true);
                    setShowCustom(false);
                    setTimeframe(e);
                    setStartDate("");
                    setEndDate("");
                  } else {
                    setShowCustom(false);
                    setShowOne(false);
                    setTimeframe(e);
                  }
                }}
                value={timeframe}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="td">This Day</SelectItem>
                  <SelectItem value="tm">This Month</SelectItem>
                  <SelectItem value="lm">Last Month</SelectItem>
                  <SelectItem value="ty">This Year</SelectItem>
                  <SelectItem value="ly">Last Year</SelectItem>
                  <SelectItem value="c">Custom</SelectItem>
                  <SelectItem value="od">One Day</SelectItem>{" "}
                  {/* New option for One Day */}
                </SelectContent>
              </Select>
            </div>
          </TabNavigation>

          <div className="mt-5">
            {tab === "charts" ? (
              <Charts bills={filterBills} canteen={filterCanteen} />
            ) : tab === "bills" ? (
              <DataTable columns={billColumns} data={filterBills} />
            ) : tab === "canteen" ? (
              <DataTable columns={canteenColumns} data={filterCanteen} />
            ) : (
              <DataTable columns={transactionColumns} data={filterTransactions} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
