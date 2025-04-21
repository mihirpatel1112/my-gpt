import React from 'react'

export default function ReceiveMessage(props: any) {
    const {value} = props;
  return (
    <div className='bg-white text-slate-800 mr-auto max-w-[90%] sm:max-w-[60%] p-2 rounded-lg'>
        {value}
    </div>
  )
}
