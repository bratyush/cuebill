import PieChart from "@/components/nivo/pie";
import { BarChart } from "@/components/tremor/bar";
import { Card } from "@/components/tremor/card";
import { BillType, ctnBllInt } from "@/types/myTypes";
import { formatElapsedRound } from "@/utils/formatters";


export default function Charts({bills, canteen}: {bills: BillType[], canteen: ctnBllInt[]}) {

  const totalRevenue = bills.reduce((acc, bill) => acc + bill.totalAmount, 0).toFixed(2)

  const canteenRevenue = bills.reduce((acc, bill) => acc + (bill.canteenMoney ?? 0), 0).toFixed(2)

  const tableRevenue = bills.reduce((acc: { [key: string]: number }, bill: BillType) => {
    if (!acc[bill?.table?.name??0]) {
      const tableName = bill?.table?.name ?? 0;
      if (!acc[tableName]) {
        acc[tableName] = 0;
      }
      acc[tableName] += bill.totalAmount ?? 0;
    }
    return acc;
  }, {});
  
  const tableRevenueList = Object.entries(tableRevenue).map(([name, revenue]) => ({ name, revenue }));

  const ctn = canteen.reduce((acc: { [key: string]: number }, bill: ctnBllInt) => {
      if (!acc[bill?.item?.name??0]) {
        const itemName = bill?.item?.name ?? 0;
        if (!acc[itemName]) {
          acc[itemName] = 0;
        }
        acc[itemName] += bill.amount;
      }
    return acc;
  }, {});

  const canteenRevenueList = Object.entries(ctn).map(([name, revenue]) => ({ name, revenue }));

  const canteenQuantity = canteen.reduce((acc: { [key: string]: number }, bill: ctnBllInt) => {
    if (!acc[bill?.item?.name??0]) {
      const itemName = bill?.item?.name ?? 0;
      if (!acc[itemName]) {
        acc[itemName] = 0;
      }
      acc[itemName] += bill.quantity;
    }
    return acc;
  }, {});

  const canteenQuantityList = Object.entries(canteenQuantity).map(([name, quantity]) => ({ name, quantity }));

  const tableTime = bills.reduce((acc: { [key: string]: number }, bill: BillType) => {
    if (!acc[bill?.table?.name??0]) {
      const tableName = bill?.table?.name ?? 0;
      if (!acc[tableName]) {
        acc[tableName] = 0;
      }
      acc[tableName] += bill.timePlayed??0;
    }
    return acc;
  }, {});
  
  const tableTimeList = Object.entries(tableTime).map(([name, timePlayed]) => ({ name, time: timePlayed }));
  
  const payMode = bills.reduce((acc: { [key: string]: number }, bill: BillType) => {
    if (!acc[bill.paymentMode]) {
      const paymentMode = bill.paymentMode ?? 0;
      if (!acc[paymentMode]) {
        acc[paymentMode] = 0;
      }
      acc[paymentMode] += 1;
    }
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

  return (
    <div className="grid grid-cols-10 gap-4">

      <div className="grid grid-rows-2 col-span-2 gap-4">
        <Card className="mx-auto max-w-xs">
          <p className="text-gray-500">
            Total Revenue
          </p>
          <p className="my-2 text-4xl font-semibold">
            &#8377;{totalRevenue}
          </p>
        </Card>

        <Card className="mx-auto max-w-xs">
          <p className="text-gray-500">
            Canteen Revenue
          </p>
          <p className="my-2 text-4xl font-semibold">
            &#8377;{canteenRevenue}
          </p>
        </Card>
      </div>
      
      {/* item revenues */}
      <Card className="mx-auto w-md max-w-sm col-span-2">
          <p className="text-gray-500">
            Canteen Item Revenue
          </p>
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

      {/* item quantity */}
      <Card className="mx-auto w-md max-w-sm col-span-2">
          <p className="text-gray-500">
            Canteen Item Quantity
          </p>
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

      {/* Payment Modes */}
      <Card className="mx-auto w-md max-w-sm col-span-3">
        <p className="text-gray-500">
          Payment Mode
        </p>
        <div className="h-60">
          <PieChart data={payModeList}/>
        </div>
      </Card>

      {/* table revenues */}
      <Card className="mx-auto w-md max-w-sm col-span-3">
          <p className="text-gray-500">
            Tables Revenue
          </p>
        <BarChart
          className="h-60"
          data={tableRevenueList}
          index="name"
          categories={["revenue"]}
          valueFormatter={(number: number) =>
            `₹${Intl.NumberFormat("en-In").format(number).toString()}`
          }
          onValueChange={(v) => console.log(v)}
        />
      </Card>

      {/* table times */}
      <Card className="mx-auto w-xl max-w-sm col-span-3">
        <p className="text-gray-500">
            Table Time
          </p>
        <BarChart
          className="h-60"
          data={tableTimeList}
          index="name"
          categories={["time"]}
          valueFormatter={(number: number) =>
            `${formatElapsedRound(number)}`
          }
          colors={['emerald']}
          onValueChange={(v) => console.log(v)}
        />
      </Card>

    </div>
  )
}