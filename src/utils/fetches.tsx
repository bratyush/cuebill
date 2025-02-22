import { BillType } from "~/types/myTypes";

// Universal fetcher function
export async function universalFetcher(route: string, method: string, body?: any) {
  const response = await fetch(route, {
    method: method,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
}

// export const checkInTable = (id: number, time: number) =>
//   fetch("/api/tables/" + id, {
//     method: "PATCH",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       checked_in_at: time,
//     }),
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const checkOutTable = (id: number) =>
//   fetch("/api/tables/" + id, {
//     method: "PATCH",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       checked_in_at: null,
//     }),
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const getTables = () =>
//   fetch("/api/tables", {
//     method: "GET",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       return data.tables;
//     });

// export const getBills = () =>
//   fetch("/api/bills", {
//     method: "GET",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const createBill = (tableId: number) =>
//   fetch("/api/bills", {
//     method: "POST",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       table: tableId,
//     }),
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const settleBill = (bill: BillType) =>
//   fetch("/api/bills/" + bill.id, {
//     method: "PATCH",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bill),
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const deleteBill = (billId: number) =>
//   fetch("/api/bills/" + billId, {
//     method: "DELETE",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const createCanteenBill = (
//   billId: number,
//   itemId: number | undefined,
//   quantity: number,
//   amount: number,
// ) =>
//   fetch("/api/bills/canteen/", {
//     method: "POST",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       billId: billId,
//       itemId: itemId,
//       quantity: quantity,
//       amount: amount,
//     }),
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const deleteCanteenBill = (billId: number) =>
//   fetch("/api/bills/canteen/" + billId, {
//     method: "DELETE",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const settleCanteenBill = (body: any) =>
//   fetch("/api/bills/canteen/", {
//     method: "PATCH",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => data.bill);

// export const getItems = () =>
//   fetch("/api/items", {
//     method: "GET",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const addItem = (item: { itemName: string; price: number }) =>
//   fetch("/api/items", {
//     method: "POST",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ name: item.itemName, price: item.price }),
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const editItem = (
//   itemId: number,
//   item: { name: string; price: number },
// ) =>
//   fetch("/api/items/" + itemId, {
//     method: "PATCH",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(item),
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const deleteItem = (itemId: number) =>
//   fetch("/api/items/" + itemId, {
//     method: "DELETE",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const getCanteenTotal = (billId?: string) =>
//   fetch("/api/bills/canteen/total/" + billId, {
//     method: "GET",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

// export const getData = () =>
//   fetch("/api/data", {
//     method: "GET",
//     headers: {
//       "Cache-Control": "no-cache",
//       "Content-Type": "application/json",
//     },
//   }).then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   });

export const fetcher = (url: string) =>
  universalFetcher(url, "GET");
