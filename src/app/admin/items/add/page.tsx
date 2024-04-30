"use client"

import { useState } from 'react';

import { useRouter } from 'next/navigation';

export default function AddTable() {
  const [itemName, setItemName] = useState<string>('');
  const [cost, setCost] = useState<number>();

  const router = useRouter()

  function addItemSubmit(itemName: string, cost?: number) {
    console.log('item', itemName, cost)

    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name:itemName, cost:cost})
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(() => {
      router.push('/admin/items')
    }).catch(error => {
      console.error('Fetch error:', error);
    })
  }

  return (
    <div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addItemSubmit(
            itemName,
            cost,
          );
        }}
        className="max-w-md mx-auto">
        
        <div className='my-5 tex text-2xl font-semibold'>
          Add Item to Inventory
        </div>

        <div className="mb-5">
          <label
            htmlFor="itemName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Item Name
          </label>
          <input
            type="itemName"
            id="itemName"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            value = {itemName}
            onChange={(e)=>{setItemName(e.target.value)}}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="cost"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Cost (&#8377;)
          </label>
          <input
            type="number"
            id="cost"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            required
            value = {cost}
            onChange={(e)=>{setCost(parseFloat(e.target.value))}}
          />
        </div>

        {/* <div className="mb-5">
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
        </div> */}

        <div className="flex mb-6 justify-end">

          <div className='p-3'>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
