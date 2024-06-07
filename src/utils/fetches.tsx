import { BillType } from "~/types/myTypes";

export const checkInTable = (id: number) =>
  fetch("/api/tables/" + id, {
    method: "PATCH",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checked_in_at: Date.now(),
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const checkOutTable = (id: number) =>
  fetch("/api/tables/" + id, {
    method: "PATCH",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checked_in_at: null,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const getTables = () =>
  fetch("/api/tables", {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const getBills = () =>
  fetch("/api/bills", {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const createBill = (tableId: number) =>
  fetch("/api/bills", {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      table: tableId,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const patchBill = (bill: BillType) =>
  fetch("/api/bills/" + bill.id, {
    method: "PATCH",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const createCanteenBill = (
  billId: number,
  itemId: number,
  quantity: number,
  amount: number,
) =>
  fetch("/api/bills/canteen/", {
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      billId: billId,
      itemId: itemId,
      quantity: quantity,
      amount: amount,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const deleteCanteenBill = (billId: number) => 
  fetch("/api/bills/canteen/" + billId, {
    method: "DELETE",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const getItems = () =>
  fetch("/api/items", {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

export const getData = () =>
  fetch("/api/data", {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });