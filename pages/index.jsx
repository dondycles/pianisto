import Head from "next/head";
import Image from "next/image";

import { GiGrandPiano } from "react-icons/gi";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pianisto</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="absolute top-0 bottom-0 left-0 right-0 flex md:flex-row flex-col-reverse items-center justify-center px-4 gap-y-0 gap-x-1">
        <div className="flex flex-col h-fit w-[300px] m-0">
          <h1 className="text-4xl md:text-6xl font-black text-center md:text-left md:mx-0 mx-auto">
            Pianisto
          </h1>
          <p className="text-center md:text-left md:mx-0 mx-auto">
            The all-in-one app that helps you learn how to play a piano
            step-by-step.
          </p>
          <button className="mt-8 px-4 py-2 mx-auto md:mx-0 rounded font-bold bg-white text-indigo-600 active:drop-shadow-md hover:drop-shadow-xl group/lmBtn relative overflow-hidden flex items-center justify-center">
            <span className="z-10 group-hover/lmBtn:text-white duration-500 ease-in-out ">
              Learn More
            </span>
            <span className="z-0 absolute top-0 bottom-0 h-full aspect-square rounded-full bg-black scale-0 group-hover/lmBtn:scale-[1000%] duration-500 ease-in-out"></span>
          </button>
        </div>
        <div className="max-w-[400px] h-fit m-0 flex items-center justify-center  ">
          <GiGrandPiano className="text-[200px] md:text-[400px]" />
        </div>
      </main>
    </>
  );
}
