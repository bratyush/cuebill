import { BillType } from "~/types/myTypes";

export const checkInTable = (id: number) =>
  fetch('/api/tables/'+ id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      checked_in_at: Date.now(),
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })

export const checkOutTable = (id: number) =>
  fetch('/api/tables/'+ id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      checked_in_at: null,
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })

export const getTables = () =>
  fetch('/api/tables', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })

export const createBill = (tableId: number) =>
  fetch('/api/bills', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      table: tableId,
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })

export const patchBill = (bill:BillType) =>
  fetch('/api/bills/'+bill.id, {
    method:'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bill)
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })