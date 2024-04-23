import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { TableType } from "../types/myTypes";

export const checkTables = async () => {
  return await exists('tables.json', { dir: BaseDirectory.LocalData });
}

export const createTables = async () => {
  await writeTextFile({ path: 'tables.json', contents: JSON.stringify({ tables: [] }) }, { dir: BaseDirectory.LocalData });
}

export const checkBills = async () => {
  return await exists('bills.json', { dir: BaseDirectory.LocalData });
}

export const createBills = async () => {
  await writeTextFile({ path: 'bills.json', contents: JSON.stringify({ bills: [] }) }, { dir: BaseDirectory.LocalData });
}

export const getBills = async () => {
  const file = await readTextFile('bills.json', { dir: BaseDirectory.LocalData });
  let bills = JSON.parse(file)
  return bills.bills
}

export const addBill = async (bill: any) => {
  const file = await readTextFile('bills.json', { dir: BaseDirectory.LocalData });
  let bills = JSON.parse(file)
  bills.bills.push({...bill, id: bills.bills.length});
  await writeTextFile({ path: 'bills.json', contents: JSON.stringify(bills) }, { dir: BaseDirectory.LocalData });
}

export const getTables = async () => {
  const file = await readTextFile('tables.json', { dir: BaseDirectory.LocalData });
  let tables = JSON.parse(file)
  return tables.tables
};

export const setTables = async (content: string) => {
  await writeTextFile({ path: 'tables.json', contents: content }, { dir: BaseDirectory.LocalData });
};

export const editTable = async (id: number, data: any) => {
  console.log(id, data);
  const tables = await getTables();
  const index = tables.findIndex((table: TableType) => table.id === id);
  tables[index] = { ...tables[index], ...data };
  await setTables(JSON.stringify({ tables }));

  return tables;
};

export const addTable = async (table: any) => {
  const tables = await getTables();
  let id;
  if (tables.length == 0) { 
    id = 0
  } else {
    id = tables[tables.length-1].id + 1
  }
  tables.push({ id:id, ...table});
  await setTables(JSON.stringify({ tables }));
}

export const deleteTable = async (id: number) => {
  const tables = await getTables();
  const index = tables.findIndex((table: TableType) => table.id === id);
  tables.splice(index, 1);
  await setTables(JSON.stringify({ tables }));
}

export const getTable = async (id: number) => {
  const tables = await getTables();
  console.log('tables', tables);
  const index = tables.findIndex((table: TableType) => table.id === id);
  console.log('index', index)
  return tables[index];
}