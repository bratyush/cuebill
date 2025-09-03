"use client";

import { TabNavigation, TabNavigationLink } from "@/components/tremor/tabNav";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/dataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ctnBllInt,
  type BillType,
  type TransactionType,
} from "@/types/myTypes";
import { getDateRange, getReportName } from "@/utils/common";
import { useState } from "react";
import useSWR from "swr";
import Charts from "./charts";
import Breakdown from "./breakdown";
import { billColumns, canteenColumns, transactionColumns } from "./columns";
import { ChartSkeleton } from "@/app/_components/skeletons";

export default function Revenue() {
  const [tab, setTab] = useState<string>("charts");
  const [showCustom, setShowCustom] = useState<boolean>(false);
  const [showOne, setShowOne] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>("td");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, error, isLoading } = useSWR<{
    bills: BillType[];
    canteen: ctnBllInt[];
    transactions: TransactionType[];
    charts: {
      totalRevenue: number;
      canteenRevenue: number;
      tableRevenueList: {name: string; revenue: number}[];
      canteenRevenueList: {name: string; revenue: number}[];
      canteenQuantityList: {name: string; quantity: number}[];
      tableTimeList: {name: string; time: number}[];
      payModeList: {id: string; value: number; color: string}[];
    };
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
      a.download = `${getReportName(timeframe, startDate, endDate)}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report');
    }
  };

  return (
    <div className="container mx-auto py-2">
      {error && <div>Error: {error.message}</div>}      
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
            <TabNavigationLink
              onClick={() => setTab("breakdown")}
              active={tab === "breakdown"}
            >
              Breakdown
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
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuItem onClick={() => downloadReport('pdf')}>
                    Download PDF
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => downloadReport('excel')}>
                    Download Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TabNavigation>

          <div className="mt-5">
            {isLoading && <ChartSkeleton />}

            {tab === "charts" && data && <Charts charts={data.charts} />}
            {tab === "bills" && data && <DataTable columns={billColumns} data={data.bills} />}
            {tab === "canteen" && data && <DataTable columns={canteenColumns} data={data.canteen} />}
            {tab === "transactions" && data && <DataTable columns={transactionColumns} data={data.transactions} />}
            {tab === "breakdown" && data && (
              <Breakdown 
                bills={data.bills} 
                canteen={data.canteen} 
                transactions={data.transactions}
                timeframe={timeframe}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </div>
        </>
    </div>
  );
}
