import PieChart from "@/components/nivo/pie";
import { BarChart } from "@/components/tremor/bar";
import { Card } from "@/components/tremor/card";
import { formatElapsedRound } from "@/utils/common";


export default function Charts({charts}: {
  charts: {
    totalRevenue: number;
    canteenRevenue: number;
    tableRevenueList: {name: string; revenue: number}[];
    canteenRevenueList: {name: string; revenue: number}[];
    canteenQuantityList: {name: string; quantity: number}[];
    tableTimeList: {name: string; time: number}[];
    payModeList: {id: string; value: number; color: string}[];
  }
}) {

  const { 
    totalRevenue, 
    canteenRevenue, 
    tableRevenueList, 
    canteenRevenueList, 
    canteenQuantityList, 
    tableTimeList, 
    payModeList 
  } = charts;

  return (
    <div className="space-y-6">
      {/* Revenue Summary & Table Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="grid grid-rows-2 lg:col-span-2 gap-6">
          <Card className="text-center p-6">
            <p className="text-gray-500 text-lg">Total Revenue</p>
            <p className="my-3 text-4xl font-semibold">&#8377;{Intl.NumberFormat("en-IN").format(totalRevenue)}</p>
          </Card>
          <Card className="text-center p-6">
            <p className="text-gray-500 text-lg">Canteen Revenue</p>
            <p className="my-3 text-4xl font-semibold">&#8377;{Intl.NumberFormat("en-IN").format(canteenRevenue)}</p>
          </Card>
        </div>

        <Card className="lg:col-span-4">
          <p className="text-gray-500 mb-4">Tables Revenue</p>
          <BarChart
            className="h-60"
            data={tableRevenueList}
            index="name"
            categories={["revenue"]}
            valueFormatter={(number: number) =>
              `₹${Intl.NumberFormat("en-In").format(number).toString()}`
            }
            colors={['emerald']}
            onValueChange={(v) => console.log(v)}
          />
        </Card>

        <Card className="lg:col-span-4">
          <p className="text-gray-500 mb-4">Table Time</p>
          <BarChart
            className="h-60"
            data={tableTimeList}
            index="name"
            categories={["time"]}
            valueFormatter={(number: number) =>
              `${formatElapsedRound(number)}`
            }
            onValueChange={(v) => console.log(v)}
          />
        </Card>
      </div>

      {/* Canteen & Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-500 mb-4">Payment Mode</p>
          <div className="h-60">
            <PieChart data={payModeList}/>
          </div>
        </Card>

        <Card>
          <p className="text-gray-500 mb-4">Canteen Item Revenue</p>
          <BarChart
            className="h-60"
            data={canteenRevenueList}
            index="name"
            categories={["revenue"]}
            valueFormatter={(number: number) =>
              `₹${Intl.NumberFormat("en-In").format(number).toString()}`
            }
            onValueChange={(v) => console.log(v)}
          />
        </Card>

        <Card>
          <p className="text-gray-500 mb-4">Canteen Item Quantity</p>
          <BarChart
            className="h-60"
            data={canteenQuantityList}
            index="name"
            categories={["quantity"]}
            colors={['emerald']}
            valueFormatter={(number: number) =>
              `${Intl.NumberFormat("en-In").format(number).toString()}`
            }
            onValueChange={(v) => console.log(v)}
          />
        </Card>
      </div>
    </div>
  )
}