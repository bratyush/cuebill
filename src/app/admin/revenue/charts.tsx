import { Card } from "~/components/tremor/card";
import { BarChart } from "~/components/tremor/bar";
import { BillType } from "~/types/myTypes";
import PieChart from "./pie";


export default function Charts({bills, canteen}: {bills: BillType[], canteen: any}) {

  const totalRevenue = bills.reduce((acc, bill) => acc + bill.totalAmount, 0).toFixed(2)

  const canteenRevenue = bills.reduce((acc, bill) => acc + bill.canteenMoney, 0).toFixed(2)

  const tableRevenue = bills.reduce((acc: { [key: string]: number }, bill: BillType) => {
    if (!acc[bill.table.name]) {
      acc[bill.table.name] = 0;
    }
    acc[bill.table.name] += bill.totalAmount;
    return acc;
  }, {});
  
  const tableRevenueList = Object.entries(tableRevenue).map(([name, revenue]) => ({ name, revenue }));

  const canteenRevenueList = canteen;

  const tableTime = bills.reduce((acc: { [key: string]: number }, bill: BillType) => {
    if (!acc[bill.table.name]) {
      acc[bill.table.name] = 0;
    }
    acc[bill.table.name] += bill.timePlayed??0;
    return acc;
  }, {});
  
  const tableTimeList = Object.entries(tableTime).map(([name, timePlayed]) => ({ name, timePlayed }));
  
  const payMode = bills.reduce((acc: { [key: string]: number }, bill: BillType) => {
    if (!acc[bill.paymentMode]) {
      acc[bill.paymentMode] = 0;
    }
    acc[bill.paymentMode] += 1;
    return acc;
  }, {});
  
  const payModeList = Object.entries(payMode).map(([mode, bills]) => ({ id:mode, value:bills, color: '' }));
  payModeList.map((mode) => {
    if (mode.id == 'cash') {
      mode.color = '#10b981';
    } else if (mode.id == 'upi') {
      mode.color = '#3b82f6';
    } else if (mode.id == 'both') {
      mode.color = '#f59e0b';
    }
  });
  console.log(payModeList);

  return (
    <div className="flex flex-row">

      <Card className="mx-auto max-w-sm h-80">
        <PieChart data={payModeList}/>
      </Card>

      <div className="flex flex-col">
        <Card className="mx-auto max-w-xs">
          <p className="text-gray-500">
            Total Revenue
          </p>
          <p className="text-3xl font-semibold">
            &#8377;{totalRevenue}
          </p>
        </Card>

        <Card className="mx-auto max-w-xs">
          <p className="text-gray-500">
            Canteen Revenue
          </p>
          <p className="text-3xl font-semibold">
            &#8377;{canteenRevenue}
          </p>
        </Card>
      </div>


      {/* table revenues */}
      <Card className="mx-auto max-w-sm">
        <BarChart
          className="h-80"
          data={tableRevenueList}
          index="name"
          categories={["revenue"]}
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("en-In").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
        />
      </Card>

      {/* item revenues */}
      <Card className="mx-auto max-w-sm">
        <BarChart
          className="h-80"
          data={canteenRevenueList}
          index="name"
          categories={["revenue", "quantity"]}
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("en-In").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
        />
      </Card>

      {/* table times */}
      <Card className="mx-auto max-w-sm">
        <BarChart
          className="h-80"
          data={tableTimeList}
          index="name"
          categories={["timePlayed"]}
          valueFormatter={(number: number) =>
            `${Intl.NumberFormat("en-In").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
        />
      </Card>

    </div>
  )
}