"use client";

import { useEffect } from "react";
import { getTables } from "~/utils/fetches";
import type { TableType } from "../types/myTypes";
import NavBar from "./_components/navbar";
import { TableSkeleton } from "./_components/skeletons";
import Table from "./table";
import useSWR from "swr";
import FoodBill from "./food";

export default function Pos() {
  const { data, isLoading } = useSWR<TableType[]>("/api/tables", getTables, {
    onSuccess: (data) => {
      localStorage.setItem("tables", JSON.stringify(data));
    },
  });

  const localTables = localStorage.getItem("tables");
  const numTables = localTables ? JSON.parse(localTables).length : 0;

  useEffect(() => {
    const a = localStorage.getItem("tables");
    if (!a) {
      localStorage.setItem("tables", JSON.stringify([]));
    }
  }, []);

  return (
    <div>
      <NavBar />

      <div className="m-2 flex flex-row flex-wrap text-white">
        {isLoading &&
          Array(numTables)
            .fill(null)
            .map((_, index) => <TableSkeleton key={index} />)}

        {data &&
          data
            .map((table, index) => (
              <Table tableData={data} key={index} table={table} />
            ))}

        {/* <div className="m-3 h-[268px] w-[350px] rounded-md bg-slate-300 flex items-center">
          <Link
            href={"/admin/tables/add"}
            className="mx-auto rounded-md bg-slate-400 p-3 hover:bg-slate-500">
            Add Table
          </Link>
        </div> */}

        <FoodBill table={{ id: 0, name: "Canteen", rate:0, theme:'canteen', checked_in_at: null, unsettled:[]}} />

      </div>
    </div>
  );
}
