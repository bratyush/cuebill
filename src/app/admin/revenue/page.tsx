"use client";


import { useState } from "react";
import useSWR from "swr";
import { TabNavigation, TabNavigationLink } from "~/components/tremor/tabNav";
import { DataTable } from "~/components/ui/dataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ctnBllInt, type BillType } from "~/types/myTypes";
import { getData } from "~/utils/fetches";
import Charts from "./charts";
import { columns } from "./columns";


export default function Revenue() {

  const {data, error, isLoading} = useSWR<{bills: BillType[], canteen: ctnBllInt[]}>(`/api/data`, getData)

	const [tab, setTab] = useState<boolean>(true);

	const [showCustom, setShowCustom] = useState<boolean>(false);

	const [timeframe, setTimeframe] = useState<string>("tm");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	let filterBills: BillType[] = [];
	let filterCanteen: ctnBllInt[] = [];


	if (data) {
		// filter data based on timeframe

		filterBills = data.bills.filter((bill) => {
			if (bill.checkIn) {
				const date = new Date(bill.checkIn);
				const now = new Date();
				if (timeframe == 'tm') {
					return date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
				} else if (timeframe == 'lm') {
					if (now.getMonth() == 0) {
						return date.getMonth() == 11 && date.getFullYear() == now.getFullYear()-1;
					}
					return date.getMonth() == now.getMonth()-1 && date.getFullYear() == now.getFullYear();
				} else if (timeframe == 'ty') {
					return date.getFullYear() == now.getFullYear();
				} else if (timeframe == 'ly') {
					return date.getFullYear() == now.getFullYear()-1;
				} else if (timeframe == 'c') {
					const start = new Date(startDate);
					const end = new Date(endDate);
					return date >= start && date <= end;
				}

				return true;
			}
		});

		filterCanteen = data.canteen.filter((canteen) => {
			if (canteen.bill?.checkIn) {
				const date = new Date(canteen.bill.checkIn);
				const now = new Date();
				if (timeframe == 'tm') {
					return date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
				} else if (timeframe == 'lm') {
					if (now.getMonth() == 0) {
						return date.getMonth() == 11 && date.getFullYear() == now.getFullYear()-1;
					}
					return date.getMonth() == now.getMonth()-1 && date.getFullYear() == now.getFullYear();
				} else if (timeframe == 'ty') {
					return date.getFullYear() == now.getFullYear();
				} else if (timeframe == 'ly') {
					return date.getFullYear() == now.getFullYear()-1;
				} else if (timeframe == 'c') {
					const start = new Date(startDate);
					const end = new Date(endDate);
					return date >= start && date <= end;
				}

				return true;
			}
		});
	}

  return (
    <div className="container mx-auto py-2">
      {error && <div>Error: {error.message}</div>}
      {isLoading && <div>Loading...</div>}
      {data && <>

        <TabNavigation>
          <TabNavigationLink onClick={()=>setTab(true)} active={tab}>Charts</TabNavigationLink>
          <TabNavigationLink onClick={()=>setTab(false)} active={!tab}>Bills</TabNavigationLink>
          
          <div className="ml-auto flex flex-row m-2 gap-4">

						{showCustom && <div className="flex flex-row border border-gray-200 rounded-md px-2">
							<p className="my-auto mr-4">from :</p>
							<input value={startDate} onChange={(e)=>setStartDate(e.target.value)} type="date"></input>
							<p className="my-auto mx-4">to :</p>
							<input value={endDate} onChange={(e)=>setEndDate(e.target.value)} type="date"></input>
						</div>}

            <Select onValueChange={(e)=>{
								if (e == 'c') setShowCustom(true)
								else setShowCustom(false)
								setTimeframe(e)}
							} value={timeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tm">This Month</SelectItem>
                <SelectItem value="lm">Last Month</SelectItem>
                <SelectItem value="ty">This Year</SelectItem>
                <SelectItem value="ly">Last Year</SelectItem>
                <SelectItem value="c">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </TabNavigation>

        <div className="mt-5">
					{tab ?
						<Charts bills={filterBills} canteen={filterCanteen} />
					:
						<DataTable columns={columns} data={filterBills} />
					}
        </div>

      </>}
    </div>
  );
}
