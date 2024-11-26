import React from 'react'

export default function UserCard() {
  return (
    <div className='w-full h-96 border-2 border-dashed border-black items-center justify-center flex flex-col rounded-xl'>
        <div className='w-36 h-36 bg-black rounded-full'>
            <img
                className='w-full h-full object-cover rounded-full'
                src='https://loremflickr.com/200/200?random=1' alt='User' 
            />
        </div>
        <p className='mt-4 text-2xl font-bold text-[#121212]'>John Doe</p>
        <p className='text-[#121212]'>
            <span className='text-[#121212]'>@</span>
            <span className='text-[#121212]'>johndoe</span>
        </p>
        {/* Connected Services Listed Here When Fetch Data About User*/}

    </div>
  )
}
