import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import { channel } from "diagnostics_channel";


export default function SideBar({}) {
  const { signedUser, signOut, socket,channelIn } = useMyContext();
 
 useEffect(() => {
  console.log('channel in from main ' + channelIn.id)
 }, [channelIn])
 

  return (
    <section className="p-2">
    <h1>
        {channelIn? channelIn.name : 'No channel selected'}
    </h1>
       
    </section>
  );
}
