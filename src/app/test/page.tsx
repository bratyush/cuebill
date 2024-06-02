"use client";

export default function asdf() {



  return (
    <div>
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
    </div>
  )
}