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
  } = useMyContext();
  const [messages, setmessages] = useState<any[]>([]);
  const [emojion, setemojion] = useState(false);
  const messageScroll = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    console.log(channelIn)
    if (channelIn && signedUser) {
      const HandleMessage = (message: any) => {
     
        if (message.channel === channelIn.channel_id) {
          setmessages((oldOne: any) => [...oldOne, message]);
        }
      };
      if (socket) {
        socket.off("newmessage");
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
      console.log("dismounted");
    };
  }, [channelIn]);

  useEffect(() => {
    if (messageScroll.current) {
      const scrollDown = messageScroll.current;
      scrollDown.scrollTop = scrollDown.scrollHeight;
    }
    console.log(channelIn);
  }, [channelIn, messages]);

  return (
    <section
      onClick={(e) => {
        e.stopPropagation();
        setSidebarOn(false);
        setFriendsOn(false);
        setemojion(false);
      }}
      className="w-full relative min-w-[400px]  bg-zinc-800 flex flex-col "
    >
      <header className="flex relative items-center justify-between  py-3  text-left shadow-[0px_7px_20px_0px_rgba(0,_0,_0,_1)]">
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOn(!sidebarOn);
          }}
          className={` transition-all ${
            sidebarOn ? "opacity-0" : "opacity-100"
          }  rounded-tr-xl rounded-br-xl   w-10 h-10 flex flex-col items-center justify-center  `}
        >
          <AiOutlineMenu size={18} className="text-zinc-50" />
        </span>
        <div className="flex flex-col w-full px-3">
          <h1 className="bg-gradient-to-b flex items-center from-neutral-100 via-gray-200 to-neutral-900 bg-clip-text text-transparent font-medium text-xl ">
            <PiPlugsConnectedFill className=" text-zinc-50 m-2" size={25} />
            {channelIn ? `${channelIn.channel_name}` : "No channel selected"}
          </h1>
        </div>

        <span
          onClick={(e) => {
            e.stopPropagation();
            setFriendsOn(!sidebarOn);
          }}
          className={` transition-all ${
            friendsOn ? "opacity-0" : "opacity-100"
          }  rounded-tl-xl rounded-bl-xl   w-10 h-10 flex flex-col items-center justify-center  `}
        >
          <PiUsersThreeFill size={18} className="text-zinc-50" />
        </span>
      </header>

      <article
        ref={messageScroll}
        className=" overflow-y-scroll  bg-zinc-800 p-6 pb-32 flex flex-col justify-between custom-scrollbar"
      >
        {channelIn && (
          <div>
            <p>{channelIn.channel_name}</p>
            <p>{channelIn.channel_description}</p>
          </div>
        )}
        {messages &&
          messages.map((item: any, i: any) => (
            <MessageCard i={i} key={item.id} message={item} />
          ))}
      </article>
      <div className="absolute bottom-8  bg-zinc-800 left-0 w-full mx-auto h-26  ">
        <TextInput emojionprop={emojion} mymessage={setmessages} />
      </div>
    </section>
  );
}
