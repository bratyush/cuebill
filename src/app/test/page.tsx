"use client";

import toast from 'react-hot-toast';
import useSWR from 'swr';
import { ItemType } from '~/types/myTypes';
import { addItem, getItems } from '~/utils/fetches';

export default function Asdf() {

  const {data, mutate} = useSWR<{items:ItemType[]}>('/api/items', getItems)

  return (
    <div className='flex flex-col justify-between'>
      <p>asdf</p>

      {data?.items && data.items.map((item: any) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <p>{item.price}</p>
        </div>
      ))}

      <button onClick={()=>{
          if (data) {
            mutate(
              addItem({ itemName:'kaju', price:12 })
              .then(()=>getItems()), {
                optimisticData: {items:[...data.items, {id:1, name:'kaju', price:12}]},
                rollbackOnError: true,
                populateCache: true,
                revalidate: false
              }
            ).then(()=>{
              toast.success('Kaju added')
            }).catch(error => {
              toast.error('Kaju add failed')
              console.error('Fetch error:', error);
            })
          }

        }}>
        Add Kaju
      </button>
      <button onClick={()=>{
          if (data) {
            mutate(
              addItem({ itemName:'kaju', price:12 })
              .then(()=>getItems()), {
                optimisticData: {items:data.items.filter((item:ItemType)=>item.name!=='kaju')},
                rollbackOnError: true,
                populateCache: true,
                revalidate: false
              }
            )
          }
      }}>
        Delete Kaju
      </button>
    </div>
  )
}