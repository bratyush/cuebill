"use client";

import { useEffect, useState } from "react";

import pool from "@/public/pool.png";
import snooker from "@/public/snooker.png";
import Image, { type StaticImageData } from "next/image";
import { useParams, useRouter } from "next/navigation";
import { type TableType } from "~/types/myTypes";
import toast from "react-hot-toast";
import { themes } from "~/utils/consts";
import { tableTheme } from "~/utils/formatters";

export default function EditTable() {
  const [style, setStyle] = useState<string>("pool");
  const [tableName, setTableName] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [typeImg, setTypeImg] = useState<StaticImageData>(pool);

  const router = useRouter();

  const { tableId } = useParams<{ tableId: string }>();

  useEffect(() => {
    if (tableId) {
      fetch("/api/tables/" + tableId, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data: { table: TableType }) => {
          const table: TableType = data.table;
          console.log("data", table);
          setTableName(table.name);
          setRate(table.rate?.toString());
          setStyle(table.theme);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  }, [tableId]);

  useEffect(() => {
    setTypeImg(tableTheme(style))
  }, [style]);

  function addTableSubmit(tableName: string, rate: string, style: string) {
    if (tableId) {
      // editTable(parseInt(tableId), {name:tableName, rate:rate, theme:style})

      fetch("/api/tables/" + tableId, {
        method: "PATCH",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tableName, rate: rate, theme: style }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          toast.success("Table updated");
          router.push("/");
        })
        .catch((error) => {
          toast.error("There was an error!");
          console.error("Fetch error:", error);
        });
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTableSubmit(tableName, rate, style);
        }}
        className="mx-auto max-w-md"
      >
        <div className="mb-5">
          <label
            htmlFor="tableName"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Table Name
          </label>
          <input
            type="tableName"
            id="tableName"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
            value={tableName}
            onChange={(e) => {
              setTableName(e.target.value);
            }}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="rate"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Rate (&#8377; per minute)
          </label>
          <input
            type="number"
            id="rate"
            className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
            value={rate}
            onChange={(e) => {
              setRate(e.target.value);
            }}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="styles"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Table Style
          </label>
          <select
            onChange={(e) => setStyle(e.target.value)}
            id="styles"
            value={style}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Image className="h-40" src={typeImg} alt="img" />

          <div className="h-full w-full p-14">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
