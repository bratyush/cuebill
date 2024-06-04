"use client";

import useSWR, { useSWRConfig } from 'swr';
import { TableType } from '~/types/myTypes';
import { getTables } from '~/utils/fetches';

export default function asdf() {

  const {data, error, isLoading} = useSWR<{tables: TableType[]}>('/api/tables', getTables)

  const { mutate }  = useSWRConfig()

  console.log(data, error, isLoading)

  return (
    <div className='flex flex-col justify-between'>
      <p>asdf</p>

      <button onClick={()=>{
        fetch('/api/test')
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
        })
      }}>
        fetch
      </button>

      <button onClick={()=>{mutate('/api/tables')}}>
        mutate
      </button>
    </div>
  )
}