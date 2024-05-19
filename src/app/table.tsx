"use client"

import { useEffect, useState } from 'react';
import type { BillType, TableType } from '../types/myTypes';
import pool from '@/public/pool.png';
import snooker from '@/public/snooker.png';
import { calculateRevenue, formatElapsed, formatTime } from '~/utils/formatters';
import Image from 'next/image';
import { Icons } from '~/components/icons';
import { checkInTable, createBill } from '~/utils/fetches';


type TableProps = {
  table: TableType;
  setTrigger: () => void;
  showBill:() => void;
  showNote:() => void;
  showFood:() => void;
  setBill: (bill: BillType) => void;
  setBillTable: (table: TableType) => void;
};

export default function Table({ table, setTrigger, showBill, showNote, showFood, setBill, setBillTable }: TableProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(
    Date.now() - table.checked_in_at
  );
  const [generatedRevenue, setGeneratedRevenue] = useState<string>('0.00');

  const imageUrl = table.theme == 'pool' ? pool : snooker;

  function checkIn() {
    // checkIn
    console.log('checkIn')

    createBill(table.id)
    .then((data) => {
      console.log('data', data)

      localStorage.setItem('t'+table.id.toString()+'bill', data.bill.id.toString())

      checkInTable(table.id)
      .then(() => {
        setTrigger()
      }).catch(error => {
        console.error('Fetch error:', error);
      })
      
    })
    
  }

  function checkOut() {
    setBillTable(table);
    const billId = localStorage.getItem('t'+table.id.toString()+'bill')
    let tempBill : BillType = {
      table_id: table.id,
      check_in: table.checked_in_at,
      check_out: Date.now(),
      time_played: elapsedTime,
      table_money: parseFloat(generatedRevenue),
      payment_mode: 'upi',
      total_amount: parseFloat(generatedRevenue),
    }
    if (billId) {
      tempBill.id = parseInt(billId)
    }
    setBill(tempBill)
    showBill()
  }

  useEffect(() => {
    let theTimer: NodeJS.Timeout;
    if (table.checked_in_at) {
      theTimer = setInterval(() => {
        setElapsedTime(Date.now() - table.checked_in_at);
        const et = Date.now() - table.checked_in_at;
        setGeneratedRevenue(calculateRevenue(table.rate, et));
      }, 1000);
    }

    return () => {
      clearInterval(theTimer)
      setElapsedTime(0);
      setGeneratedRevenue('0.00');
    };
  }, [table.checked_in_at, table.rate]);

  return (

    <div className="h-[268px] w-[350px] m-5 relative">
      <Image
        src={imageUrl}
        alt="bg"
        layout='fill'
        objectFit='cover'
        objectPosition='center'
        className='-z-10'
        />
      {/* style={{ backgroundImage: `url(${imageUrl})` }}> */}
      <div className="pt-5 flex flex-col">
        <div className="flex mx-auto mb-2">
          <div className='flex flex-col'>
            <span className='text-xl font-bold mx-auto'>{table.name}</span>
            <span className='font-'>
              &#8377;{table.rate}/min - &#8377;
              {Math.round(table.rate * 60)}/hour
            </span>
          </div>
        </div>

        {table.checked_in_at ? (
          <div className="flex flex-col justify-evenly">
            <div className="flex justify-center font-medium">
              {formatTime(table.checked_in_at)}
            </div>

            <div className="flex flex-row justify-evenly">
              <div className="flex flex-col">
                <span className='text-sm font-thin mx-auto'>Time</span>
                <span className='font-medium'>{formatElapsed(elapsedTime)}</span>
              </div>

              <div className="flex flex-col">
                <span className='text-sm font-thin mx-auto'>Money</span>
                <span className='font-medium'>&#8377;{generatedRevenue}</span>
              </div>
            </div>

            <div className='flex flex-row mt-4 px-6'>
              <button 
                className="my-1 mr-1 basis-1/6 w-full flex items-center justify-center bg-green-400/70 hover:bg-green-400/90 rounded-md shadow-sm"
                onClick={()=>{showFood()}}
                >
                <Icons.food />
              </button>
              <button 
                className="my-1 mr-1 basis-1/6 w-full flex items-center justify-center bg-orange-400/70 hover:bg-orange-400/90 rounded-md shadow-sm"
                onClick={()=>{showNote()}} 
                >
                <Icons.note />
              </button>
              <button
                className="my-1 py-3 basis-2/3 bg-white/30 hover:bg-white/40 rounded-md shadow-sm"
                onClick={() => {
                  checkOut();
                }}>
                <span className='font-semibold'>Check Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex">
            <button
              className="py-6 px-10 my-5 mx-auto bg-white/20 hover:bg-white/30 rounded-md shadow-sm"
              onClick={() => {
                checkIn();
              }}>
              Check In
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
