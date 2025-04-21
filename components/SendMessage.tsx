import React from 'react'

export default function SendMessage(props: any) {
    const {value} = props;
  return (
    <div className='bg-indigo-300 text-slate-800 ml-auto max-w-[90%] sm:max-w-[60%] p-2 rounded-lg'>
        {value}
    </div>
  )
}
