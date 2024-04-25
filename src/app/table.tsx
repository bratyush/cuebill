"use client"

import { useEffect, useState } from 'react';
import { BillType, TableType } from '../types/myTypes';
import pool from '@/public/pool.png';
import snooker from '@/public/snooker.png';
import { calculateRevenue, formatElapsed, formatTime } from '~/utils/formatters';
import Image from 'next/image';

type TableProps = {
  table: TableType;
  setTrigger: () => void;
  showBill:() => void;
  setBill: (bill: BillType) => void;
  setBillTable: (table: TableType) => void;
};


export default function Table({ table, setTrigger, showBill, setBill, setBillTable }: TableProps) {
  const [elapsedTime, setElapsedTime] = useState<number>(
    Date.now() - table.checked_in_at
  );
  const [generatedRevenue, setGeneratedRevenue] = useState<string>('0.00');

  const imageUrl = table.theme == 'pool' ? pool : snooker;

  function checkIn() {
    // checkIn

    fetch('/api/tables/'+ table.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checked_in_at: Date.now(),
        // pausedAt: null,
        // time: 0,
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      setTrigger()
    }).catch(error => {
      console.error('Fetch error:', error);
    })

    // editTable(table.id, {
    //   checked_in_at: Date.now(),
    //   pausedAt: null,
    //   time: 0,
    // }).then(() => setTrigger());
  }

  function checkOut() {
    setBillTable(table);
    setBill({
      table_id: table.id,
      check_in: table.checked_in_at,
      check_out: Date.now(),
      time_played: elapsedTime,
      money: parseFloat(generatedRevenue),
      discount: 0,
      payment_mode: 'upi',
      total_amount: parseFloat(generatedRevenue),
    })
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
  }, [table.checked_in_at]);

  return (

    <div className="h-[222px] w-[290px] m-5 relative">
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

            <button
              className="py-3 px-5 my-1 bg-white/20 hover:bg-white/30 rounded-md shadow-sm mx-auto"
              onClick={() => {
                checkOut();
              }}>
              Check Out
            </button>
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
