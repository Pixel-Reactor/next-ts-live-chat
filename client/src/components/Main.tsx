import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import getMessages from "@/utils/getMessages";
import MessageCard from "./MessageCard";
import TextInput from "./TextInput";
export default function SideBar({}) {
  const { signedUser, signOut, socket, channelIn } = useMyContext();
  const [messages, setmessages] = useState(null);




  useEffect(() => {
    if (channelIn && signedUser) {
    const channel = channelIn;
    console.log(channel.id)
    const HandleMessage =(message:any) => {
    console.log(channel.id,message.channel)
    if (message.channel === channel.id) {
      setmessages((oldOne: any) => [...oldOne, message]);
    }
  }
   
      console.log("channel in from main " + channelIn.id);
      const Get = async () => {
        const res = await getMessages(signedUser?.token, channelIn.id);
        if (res && res.status === 200) {
          setmessages(res.data);
        }
      };
      Get();
    
    if (socket) {
        socket.on("newmessage", (message:any) => {
           HandleMessage(message)
          });
    }
}
  }, [channelIn,socket]);

  return (
    <section className="w-full relative min-w-[400px] flex flex-col overflow-hidden">
      <header className="flex flex-col justify-between border-b  border-white/30 p-3 min-h-[150px] shadow-[30px_20px_114px_0px_rgba(173,_44,_173,_0.2)]">
        <h1 className="bg-gradient-to-b from-neutral-100 via-gray-200 to-neutral-900 bg-clip-text text-transparent font-bold text-5xl ">
          {channelIn ? channelIn.name : "No channel selected"}
        </h1>
        <p className="max-w-xl p-1 b font-medium">
          {channelIn && channelIn?.description}
        </p>
      </header>
      <article></article>
      <article className=" overflow-y-scroll h-full p-3 pb-24 flex flex-col justify-between custom-scrollbar">
        {messages &&
          messages.map((item: any) => 
          <MessageCard key={item.id} message={item} />
          
          )}
      </article>
      <div className="absolute bottom-0 left-0 w-full mx-auto h-24 ">
        <TextInput />
      </div>
    </section>
  );
}
