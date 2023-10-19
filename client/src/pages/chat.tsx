import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import SideBar from "@/components/SideBar";
import Main from "@/components/Main";
import { useRouter } from "next/router";
import io from "socket.io-client";
import Image from "next/image";
import FriendsBar from "@/components/FriendsBar";
import DirectMessageComponent from "@/components/DirectMessage";
import {AiOutlineClose} from 'react-icons/ai'

export default function Home() {
  const router = useRouter();
  const { signedUser, socket, setSocket ,setSignedUser,directMessage,errormsg,setErrormsg} = useMyContext();

  useEffect(() => {
    if (!signedUser ){
      
      setSocket(null);
      router.push("/");
    }
  }, [signedUser]);

  useEffect(() => {
    if (signedUser) {
      const socketConnection = io(`${process.env.NEXT_PUBLIC_API_URL}?id=${signedUser.id}`);
      setSocket(socketConnection);
    }
  }, [signedUser]);

  useEffect(() => {

    if (socket && signedUser) {
    socket.id= signedUser.id;
      socket.on("connect", () => {
        try {
          console.log("connected");
          socket.emit("id", signedUser.id);
          socket.on("error", (error: any) => {
          console.error("Socket connection error", error);
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
    return () => {
      if(socket){
        socket.disconnect();
        setSignedUser(null)
      }
    };
  }, [socket]);


     

  return (
    <main className="border-2 border-zinc-900 select-none flex-col overflow-hidden text-zinc-300 flex bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-zinc-900 min-h-[700px] h-screen ">
      <h1 className=" px-5 py-2 h-12 flex justify-between w-full text-center  m-auto drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)] bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]  from-orange-800 via-amber-100 to-orange-900 text-md font-bold  tracking-normal ">
        <span className=" flex gap-1 justify-left items-center w-full">
          d
          <Image
            className="w-auto h-auto animate-spin-slow  "
            src="/donut.png"
            width={5}
            height={0}
            alt="donut"
          />
          nutChat!
        </span>
      </h1>
      <div className={`${errormsg.on? 'flex': 'hidden'} rounded-lg fixed top-10 z-50 p-3 text-zinc-50/50  justify-between items-center bg-zinc-800  left-0 right-0 w-80  border mx-auto border-zinc-50`}>
         <p>{errormsg.msg}</p> 
         <span onClick={(()=>setErrormsg({...errormsg,on:false}))}>
          <AiOutlineClose/>
         </span>
         </div>
      <div className="flex  justify-between gap-1 w-full h-full">
       
        <SideBar />
        {directMessage.on ? <DirectMessageComponent/> : <Main/>}
        <FriendsBar />
      </div>
    </main>
  );
}
