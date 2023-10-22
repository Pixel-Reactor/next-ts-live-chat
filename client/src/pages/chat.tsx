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
  const { signedUser, socket, setSocket ,setSignedUser,directMessage,errormsg,setErrormsg,setNotification} = useMyContext();

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
          socket.on("notification",(notification)=>setNotification(notification))
        } catch (error) {
          console.log(error);
        }
      });
    }
    return () => {
      if(socket){
        socket.disconnect();
        setSignedUser(null);
        socket.off('notification');
        socket.off('error')
      }
    };
  }, [socket]);



  return (
    <main className="border-2 border-zinc-900 h-screen select-none flex-col overflow-hidden text-zinc-300 flex bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-zinc-900 min-h-[700px]">
    
      <div className={`${errormsg.on? 'flex': 'hidden'}  rounded-lg fixed top-10 z-50 p-3 text-zinc-50/90  justify-between items-center bg-zinc-800  left-0 right-0 w-80  border mx-auto border-zinc-50`}>
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
