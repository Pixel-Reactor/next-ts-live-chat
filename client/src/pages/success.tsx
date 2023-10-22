import React, { useState, DragEvent, useRef, useEffect } from "react";

import { BsCheckCircleFill} from "react-icons/bs";


import Image from "next/image";


export default function Success() {
 
  
   
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
      <div className="max-w-xl text-zinc-50 backdrop-blur-[13px] bg-sky-600/3 w-full p-4 rounded-md  backdrop-saturate-150 ">
        <p className="text-xl text-center m-10 flex items-center justify-center gap-2">
          <span><BsCheckCircleFill className='text-green-700/70'/></span> User registered Sucessfully!</p>  
      <div className="flex flex-col m-3 sm:flex-row justify-center items-center"> 
      <p className="text-center text-lg m-3 font-medium">Check your email and click in the button to activate your account! </p>
      <img
      src="/Email.png" 
      className="w-52 h-52 sm:w-80 sm:h-80 object-cover"  
      alt="activation email" />  
      </div>
      <div className="flex flex-col m-3 sm:flex-row justify-center items-center"> 
     
      <img
      src="/sign.png" 
      className="w-52 h-52 sm:w-80 sm:h-80 object-cover"  
      alt="login" />   <p className="text-center text-lg  font-medium">You'll be redirected to the main page, sign in and you're in! </p>
      </div>
      </div>
      </div>
    </main>
  );
}
