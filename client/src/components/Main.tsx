import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import getMessages from "@/utils/getMessages";
import MessageCard from "./MessageCard";
import TextInput from "./TextInput";
import { AiOutlineMenu } from "react-icons/ai";
import { PiUsersThreeFill, PiPlugsConnectedFill } from "react-icons/pi";

export default function SideBar({}) {
  const {
    signedUser,
    socket,
    channelIn,
    sidebarOn,
    setSidebarOn,
    friendsOn,
    setFriendsOn,
    conversations,
    
  } = useMyContext();
  const [messages, setmessages] = useState<any[]>([]);
  
  const messageScroll = useRef<null | HTMLDivElement>(null);
  const [notifications, setnotifications] = useState(0)

 
  useEffect(() => {
    if (channelIn && signedUser) {
      const HandleMessage = (message: any) => {
     
        if (message.channel === channelIn.channel_id) {
          setmessages((oldOne: any) => [...oldOne, message]);
        }
      };
      if (socket) {
        socket.on("newmessage", HandleMessage);
      }
      const Get = async () => {
        const res = await getMessages(signedUser?.token, channelIn.channel_id);
        if (res && res.status === 200) {
          setmessages(res.data);
        }
      };
      Get();
    }
    return () => {
      if(socket){
        socket.off("newmessage");
      }
    };
  }, [channelIn,conversations]);

  useEffect(() => {
    if (messageScroll.current) {
      const scrollDown = messageScroll.current;
      scrollDown.scrollTop = scrollDown.scrollHeight;
    }
   
  }, [channelIn, messages]);


  useEffect(() => {
  
    let notificationnumber = 0 
    if(conversations?.length){
      conversations.map((item:any)=>{
        notificationnumber= notificationnumber+ item.new
       
      })
    } 
    setnotifications(notificationnumber)
   }, [conversations])

  return (
    <section
      onClick={(e) => {
        e.stopPropagation();
        setSidebarOn(false);
        setFriendsOn(false);
       
      }}
      className="w-full relative min-w-[400px]  bg-zinc-800 flex flex-col "
    >
      <header className="flex relative items-center justify-between  py-3 text-left shadow-[0px_7px_10px_0px_rgba(0,_0,_0,_1)]">
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOn(true);
            setFriendsOn(false)
          }}
          className={` transition-all ${
            sidebarOn ? "opacity-0" : "opacity-100"
          }  rounded-tr-xl rounded-br-xl   w-10 h-10 flex flex-col items-center justify-center  `}
        >
          <AiOutlineMenu size={22} className="text-zinc-50" />
        </span>
        <div className="flex flex-col w-full px-3">
          <h1 className="flex items-center font-medium text-md">
            <PiPlugsConnectedFill className=" text-zinc-50 m-2" size={20} />
            {channelIn ? `${channelIn.channel_name}` : "No channel selected"}
          </h1>
        </div>

        <span
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOn(false)
            setFriendsOn(true);
          }}
          className={` transition-all ${
            friendsOn ? "opacity-0" : "opacity-100"
          }   rounded-tl-xl rounded-bl-xl  flex   items-center justify-center  `}
        >
          <PiUsersThreeFill size={22} className="text-zinc-50" />
         <span 
         className="p-1 px-2  h-6 flex text- items-center justify-center rounded-md font-medium bg-sky-700"> 
         {notifications}
         </span>
        
        </span>
      </header>

      <article
        ref={messageScroll}
        className=" overflow-y-scroll  bg-zinc-800 p-6 pb-32 flex flex-col justify-between custom-scrollbar"
      >
        {channelIn && <><h1 className="text-3xl p-2 font-medium w-full  text-center">Welcome to <br />{channelIn?.channel_name} channel!</h1>
        <h2 className="text-lg p-4 font-normal w-full border-b border-zinc-50/20 text-center">{channelIn?.channel_description}</h2></>}
        
        {messages.length ?
          messages.map((item: any, i: any) => (
            <MessageCard i={i} key={item.id} message={item} />
          )) : <div className="flex flex-col font-medium items-center text-center mx-auto justify-center w-full h-full max-w-lg ">
            <img src="/wdonut.png" alt="donut" />
            <p>Oops! Looks like there are no messages in here... <br /> select a channel and be the first one!</p></div>} 
      </article>
      {channelIn &&  <div className="absolute bottom-8  bg-zinc-800 left-0 w-full mx-auto h-26  ">
        <TextInput  />
      </div>}
     
    </section>
  );
}
