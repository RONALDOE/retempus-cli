import React from "react";
import ProgressBar from "./ProgressBar";

export default function DataCard() {
  return (
    <div className='min-w-80 min-h-max p-4 flex flex-col bg-[white] rounded-lg hover:scale-105 transition-all shadow-[0px_0px_31px_-1px_rgba(255,255,255,_0.5)]  '>
      <div className='w-full h-24'>
        <img src='' alt='' className='h-full w-24 bg-black' />
      </div>
      <p className=' mt-4 text-2xl font-bold text-[#121212] '>Google Drive</p>
      <ProgressBar total={50} used={10} />
    </div>
  );
}
