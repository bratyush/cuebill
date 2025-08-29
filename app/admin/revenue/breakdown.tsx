import { DataTable } from "@/components/ui/dataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/tremor/card";
import { BillType, ctnBllInt, TransactionType } from "@/types/myTypes";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

interface BreakdownData {
  period: string;
  totalBills: number;
  totalRevenue: number;
  tableRevenue: number;
  canteenRevenue: number;
  date?: string; // For sorting purposes
}

interface BreakdownProps {
  bills: BillType[];
  canteen: ctnBllInt[];
  transactions: TransactionType[];
  timeframe: string;
  startDate: string;
  endDate: string;
}

export default function Breakdown({ bills, timeframe, startDate }: BreakdownProps) {
  
  const getBreakdownData = (): BreakdownData[] => {
    const breakdownMap = new Map<string, BreakdownData>();
    
    // Process bills based on timeframe
    bills.forEach(bill => {
      if (!bill.checkIn) return;
      
      const date = new Date(bill.checkIn);
      let periodKey: string;
      let periodDisplay: string;
      
      switch (timeframe) {
        case 'tm': // This Month - show daily breakdown
        case 'lm': // Last Month - show daily breakdown
        case 'c':  // Custom range - show daily breakdown if range <= 31 days
        case 'od': // One day - show hourly breakdown
          if (timeframe === 'od') {
            // Hourly breakdown
            const hour = date.getHours();
            periodKey = `${date.toDateString()}-${hour}`;
            periodDisplay = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
          } else {
            // Daily breakdown
            periodKey = date.toDateString();
            periodDisplay = date.toLocaleDateString('en-GB');
          }
          break;
          
        case 'ty': // This Year - show monthly breakdown
        case 'ly': // Last Year - show monthly breakdown
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          periodKey = monthKey;
          periodDisplay = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          break;
          
        case 'td': // Today - show hourly breakdown
        default:
          const hour = date.getHours();
          periodKey = `${date.toDateString()}-${hour}`;
          periodDisplay = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
          break;
      }
      
      if (!breakdownMap.has(periodKey)) {
        breakdownMap.set(periodKey, {
          period: periodDisplay,
          totalBills: 0,
          totalRevenue: 0,
          tableRevenue: 0,
          canteenRevenue: 0,
          date: date.toISOString(),
        });
      }
      
      const breakdown = breakdownMap.get(periodKey)!;
      breakdown.totalBills++;
      breakdown.totalRevenue += bill.totalAmount || 0;
      breakdown.tableRevenue += bill.tableMoney || 0;
      breakdown.canteenRevenue += bill.canteenMoney || 0;
    });
    
    return Array.from(breakdownMap.values()).sort((a, b) => 
      new Date(a.date!).getTime() - new Date(b.date!).getTime()
    );
  };

  const breakdownData = getBreakdownData();
  
  const getBreakdownTitle = () => {
    switch (timeframe) {
      case 'td':
        return 'Hourly Revenue Breakdown - Today';
      case 'tm':
        return 'Daily Revenue Breakdown - This Month';
      case 'lm':
        return 'Daily Revenue Breakdown - Last Month';
      case 'ty':
        return 'Monthly Revenue Breakdown - This Year';
      case 'ly':
        return 'Monthly Revenue Breakdown - Last Year';
      case 'od':
        return `Hourly Revenue Breakdown - ${startDate ? new Date(startDate).toLocaleDateString('en-GB') : 'Selected Day'}`;
      case 'c':
        return `Daily Revenue Breakdown - Custom Range`;
      default:
        return 'Revenue Breakdown';
    }
  };

  const getPeriodUnit = () => {
    switch (timeframe) {
      case 'td':
      case 'od':
        return 'Hours';
      case 'tm':
      case 'lm':
      case 'c':
        return 'Days';
      case 'ty':
      case 'ly':
        return 'Months';
      default:
        return 'Periods';
    }
  };

  const totalRevenue = breakdownData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalBills = breakdownData.reduce((sum, item) => sum + item.totalBills, 0);
  const averageRevenue = totalBills > 0 ? totalRevenue / totalBills : 0;

  const breakdownColumns: ColumnDef<BreakdownData>[] = [
    {
      accessorKey: "period",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {getPeriodUnit()}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "totalBills",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Bills
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "tableRevenue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Table Revenue
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const revenue = row.getValue("tableRevenue") as number;
        return <div>₹{Intl.NumberFormat("en-IN").format(revenue)}</div>;
      },
    },
    {
      accessorKey: "canteenRevenue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Canteen Revenue
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const revenue = row.getValue("canteenRevenue") as number;
        return <div>₹{Intl.NumberFormat("en-IN").format(revenue)}</div>;
      },
    },
    {
      accessorKey: "totalRevenue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Revenue
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const revenue = row.getValue("totalRevenue") as number;
        return <div className="font-semibold">₹{Intl.NumberFormat("en-IN").format(revenue)}</div>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{getBreakdownTitle()}</h2>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-semibold">₹{Intl.NumberFormat("en-IN").format(totalRevenue)}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Total {getPeriodUnit()}</p>
            <p className="text-2xl font-semibold">{breakdownData.length}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Total Bills</p>
            <p className="text-2xl font-semibold">{totalBills}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Average Revenue per Bill</p>
            <p className="text-2xl font-semibold">₹{Intl.NumberFormat("en-IN").format(Math.round(averageRevenue * 100) / 100)}</p>
          </div>
        </Card>
      </div>
      
      {/* Breakdown Table */}
      <Card className="p-6">
        <DataTable columns={breakdownColumns} data={breakdownData} />
      </Card>
    </div>
  );
}