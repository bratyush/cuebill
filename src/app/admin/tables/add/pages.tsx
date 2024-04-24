"use client"

import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import pool from '../assets/pool.jpg';
import snooker from '../assets/snooker.jpg';
import { addTable } from '../utils/tauriFiles';

export default function AddTable() {
  const [style, setStyle] = useState<string>('pool');
  const [tableName, setTableName] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [typeImg, setTypeImg] = useState<string>();

  const navigate = useNavigate();

  useEffect(() => {
    if (style === 'pool') {
      setTypeImg(pool);
    } else {
      setTypeImg(snooker);
    }
  }, [style]);

  function addTableSubmit(tableName: string, rate: string, style:string) {
    addTable({name:tableName, rate:rate, theme:style})
    .then(()=>{
      navigate('/')
    })
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTableSubmit(
            tableName,
            rate,
            style,
          );
        }}
        className="max-w-md mx-auto">
        <div className="mb-5">
          <label
            htmlFor="tableName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Table Name
          </label>
          <input
            type="tableName"
            id="tableName"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            value = {tableName}
            onChange={(e)=>{setTableName(e.target.value)}}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="rate"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Rate (&#8377; per minute)
          </label>
          <input
            type="number"
            id="rate"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            value = {rate}
            onChange={(e)=>{setRate(e.target.value)}}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="styles"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Table Style
          </label>
          <select
            onChange={(e) => setStyle(e.target.value)}
            id="styles"
            defaultValue={style}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="pool">Pool</option>
            <option value="snooker">Snooker</option>
          </select>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <img className="h-40" src={typeImg} />

          <div className='h-full w-full p-14'>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
