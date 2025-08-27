"use client";

import { TabNavigation, TabNavigationLink } from "@/components/tremor/tabNav";
import { DataTable } from "@/components/ui/dataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ctnBllInt,
  type BillType,
  type TransactionType,
} from "@/types/myTypes";
import { useState } from "react";
import useSWR from "swr";
import Charts from "./charts";
import { billColumns, canteenColumns, transactionColumns } from "./columns";

export default function Revenue() {
  const [tab, setTab] = useState<string>("bills");
  const [showCustom, setShowCustom] = useState<boolean>(false);
  const [showOne, setShowOne] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>("td");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const getDateRange = (timeframe: string, startDate: string, endDate: string): { startRange: Date | null, endRange: Date | null } => {
    const now = new Date();
    
    if (timeframe === "td") {
      // Today
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return { startRange: startOfDay, endRange: endOfDay };
    } else if (timeframe === "tm") {
      // This Month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { startRange: startOfMonth, endRange: endOfMonth };
    } else if (timeframe === "lm") {
      // Last Month
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const startOfLastMonth = new Date(lastMonthYear, lastMonth, 1);
      const endOfLastMonth = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59, 999);
      return { startRange: startOfLastMonth, endRange: endOfLastMonth };
    } else if (timeframe === "ty") {
      // This Year
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { startRange: startOfYear, endRange: endOfYear };
    } else if (timeframe === "ly") {
      // Last Year
      const lastYear = now.getFullYear() - 1;
      const startOfLastYear = new Date(lastYear, 0, 1);
      const endOfLastYear = new Date(lastYear, 11, 31, 23, 59, 59, 999);
      return { startRange: startOfLastYear, endRange: endOfLastYear };
    } else if (timeframe === "c") {
      // Custom Range
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        return { startRange: start, endRange: end };
      }
      return { startRange: null, endRange: null };
    } else if (timeframe === "od") {
      // One Day
      if (startDate) {
        const selectedDate = new Date(startDate);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999);
        return { startRange: startOfDay, endRange: endOfDay };
      }
      return { startRange: null, endRange: null };
    } else {
      // No filtering
      return { startRange: null, endRange: null };
    }
  };

  const { data, error, isLoading } = useSWR<{
    bills: BillType[];
    canteen: ctnBllInt[];
    transactions: TransactionType[];
  }>(`revenue-data-${timeframe}-${startDate}-${endDate}`, async () => {
    const { startRange, endRange } = getDateRange(timeframe, startDate, endDate);
    
    const response = await fetch('/api/revenue-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startRange: startRange?.toISOString(),
        endRange: endRange?.toISOString()
      }),
    });
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  },
  {
    refreshInterval: 60000, // Refresh every 60 seconds
    revalidateOnFocus: true, // Refresh when user returns to tab
  });

  const downloadReport = async (format: 'pdf' | 'excel') => {
    try {
      const { startRange, endRange } = getDateRange(timeframe, startDate, endDate);
      
      const response = await fetch('/api/download-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          format,
          startRange: startRange?.toISOString(),
          endRange: endRange?.toISOString(),
          timeframe // Keep for report labeling
        }),
      });

      if (!response.ok) throw new Error('Failed to download report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report');
    }
  };


  console.log(tab);

  return (
    <div className="container mx-auto py-2">
      {error && <div>Error: {error.message}</div>}
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <TabNavigation>
            <TabNavigationLink
              onClick={() => setTab("charts")}
              active={tab === "charts"}
            >
              Charts
            </TabNavigationLink>
            <TabNavigationLink
              onClick={() => setTab("bills")}
              active={tab === "bills"}
            >
              Table Bills
            </TabNavigationLink>
            <TabNavigationLink
              onClick={() => setTab("canteen")}
              active={tab === "canteen"}
            >
              Canteen Bills
            </TabNavigationLink>
            <TabNavigationLink
              onClick={() => setTab("transactions")}
              active={tab === "transactions"}
            >
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

              {/* timeframe select */}
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

              {/* Download Report Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Download Report</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => downloadReport('pdf')}>
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadReport('excel')}>
                    Download Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TabNavigation>

          <div className="mt-5">
            {tab === "charts" && data && <Charts bills={data.bills} canteen={data.canteen} />}
            {tab === "bills" && data && <DataTable columns={billColumns} data={data.bills} />}
            {tab === "canteen" && data && <DataTable columns={canteenColumns} data={data.canteen} />}
            {tab === "transactions" && data && <DataTable columns={transactionColumns} data={data.transactions} />}
          </div>
        </>
      )}
    </div>
  );
}
