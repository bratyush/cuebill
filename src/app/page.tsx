"use client"

// tables, checkedIn,
// table name, rate, checkedIn time, live time, live revenue, checkout button, pause play.

import { useEffect, useState } from 'react';
import type { BillType, TableType } from '../types/myTypes';
import Bill from '~/app/_components/billModal';
import Link from 'next/link';
import Table from './table';
import NavBar from './_components/Navbar';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { TableSkeleton } from './_components/skeletons';


export default function Pos() {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [tables, setTables] = useState<TableType[] | null>();
  const [trigger, setTrigger] = useState(false);
  const [showBill, setShowBill] = useState<boolean>(false);
  const [bill, setBill] = useState<BillType | null>(null);
  const [billTable, setBillTable] = useState<TableType | null>(null);

  const { isLoaded, isSignedIn, user } = useUser();

  const numTables = parseInt(localStorage.getItem('tables') ?? '0');

  const router = useRouter()

  useEffect(()=>{
    const a = localStorage.getItem('tables');
    if (!a) {
      localStorage.setItem('tables', JSON.stringify(0));
    } else {
      console.log('ddddddddddddd')
    }
    const b = localStorage.getItem('bills');
    if (!b) {
      localStorage.setItem('bills', JSON.stringify(0));
    }

  }, [])

  useEffect(()=>{
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/signIn')
      } else {
        console.log('signed In')
      }
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/tables', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res=>res.json())
    .then((data: {tables: TableType[]}) => {
      localStorage.setItem('tables', JSON.stringify((data.tables).length));
      setTables(data.tables);
      setIsLoading(false);
    }).catch(error => {
      console.error('Fetch error:', error);
    });

  }, [trigger]);

  function closeBill() {
    setShowBill(false)
  }

  function saveBill(bill: BillType) {
    console.log('bill', bill)

    fetch('/api/bills', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bill)
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(() => {
      setShowBill(false)
      fetch('/api/tables/'+ bill.table_id, {
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
      }).then(() => {
        setTrigger((prev) => !prev)
      }).catch(error => {
        console.error('Fetch error:', error);
      })
    }).catch(error => {
      console.error('Fetch error:', error);
    })

    // addBill(bill).then(()=>{
    //   setShowBill(false)
    //   editTable(bill.tableId, {
    //     checkedIn: null,
    //     pausedAt: null,
    //     time: 0,
    //   }).then(() => {
    //     setTrigger((prev) => !prev)
    //   });
    // })
  }

  return (
    <>
    <NavBar />
    {}

    { showBill && <Bill bill={bill} table={billTable} close={()=>{closeBill()}} save={(bill: BillType)=>saveBill(bill)}/>}
    <div className="text-white m-2 grid gap-3 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
      
      {isLoading ? Array(numTables).fill(<TableSkeleton />)
      : tables?.map((table, index) => (
        <Table
          key={index}
          table={table}
          showBill={()=>{setShowBill(true)}}
          setBill={(bill: BillType) => setBill(bill)}
          setBillTable={(table: TableType) => setBillTable(table)}
          setTrigger={() => setTrigger((prev) => !prev)}
        />
      ))}

      <div className="m-5 h-[268px] w-[350px] rounded-md bg-slate-400 flex items-center">
        <Link
          href={"/admin/tables/add"}
          className="mx-auto rounded-md bg-slate-500 p-3 hover:bg-slate-600">
          Add Table
        </Link>
      </div>
    </div>
    </>
  );
}
