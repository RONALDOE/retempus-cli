import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <div className="w-full h-[40rem] bg-[#121212] flex items-center justify-center ">
      <div className="w-1/2 flex flex-col items-start px-8">
        <h1 className="text-9xl font-bold text-white mb-4">ReTempus</h1>
        <p className="text-2xl text-gray-300">
          The Rethink of your storage management
        </p>
      </div>
      <div className="w-1/2 h-full">
        <Spline
          className="rounded-l-full shadow-xl"
          scene="https://prod.spline.design/ve-NnDpq86fOJ3Q9/scene.splinecode"
        />
      </div>
    </div>
  );
}
