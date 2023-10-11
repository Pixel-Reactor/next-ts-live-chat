import React, { useEffect,useState } from "react";

import {useRouter} from "next/router";
import Image from "next/image";


export default function Home() {
  let timeout :NodeJS.Timeout
  const router = useRouter()
  const [count, setCount] = useState(5)
  
  useEffect(()=>{
    if(count > 0){
        timeout = setTimeout(() => {
        setCount(count -1);
      }, 1000);
    } else {

        clearTimeout(timeout);
        router.push('/')
    } 
}, [count]);

  return (
    <main className=" bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-zinc-900 min-h-screen flex flex-col items-center justify-center">
       <div className="bg-[url('../svg/blurry.svg')] w-full min-h-screen bg-no-repeat bg-cover bg-center p-10 flex flex-col justify-start items-center">
      <div className="my-5 mb-10 drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)] bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]  from-orange-800 via-amber-100 to-orange-900 text-5xl font-extrabold  tracking-normal w-full text-center">
        {" "}
        <span className="mx-auto text-center flex justify-center">
          D<Image src="/donut.png" width={50} height={50} alt="donut" />
          nutChat
        </span>
      </div>
      <div className="max-w-lg flex flex-col justify-center items-center backdrop-blur-[13px] bg-sky-600/3 w-full p-4 rounded-md border border-zinc-50/10 backdrop-saturate-150 ">
      <p className="font-semibold text-xl text-zinc-50 text-center">Usuario activado con éxito! <br />Volviendo a la página principal en : <br /></p>
       <span className="mt-10 font-semibold text-2xl text-zinc-50 text-center ">{count}</span>
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
      </div>
    </main>
  );
}
