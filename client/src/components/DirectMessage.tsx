import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import MessageCard from "./MessageCard";
import DirectTextInput from "./DirectTextInput";
import {
  AiOutlineMenu,
  AiOutlineMessage,
} from "react-icons/ai";
import { PiUsersThreeFill } from "react-icons/pi";
import getUserInfo from "@/utils/getUserInfo";
import axios from "axios";
export default function DirectMessageComponent({}) {
  const {
    signedUser,
    socket,
    sidebarOn,
    setSidebarOn,
    friendsOn,
    setFriendsOn,
    directMessage,
  } = useMyContext();

  const [Dmessages, setDmessages] = useState<any[]>();
  const [emojion, setemojion] = useState(false);
  const messageScroll = useRef<null | HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<{
    avatar: string;
    name: string;
    username: string;
    bio: string;
  } | null>(null);

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      authorization: signedUser?.token || null,
    },
  });
  useEffect(() => {
    const getInfo = async () => {
      if (signedUser && directMessage.to) {
        const info = await getUserInfo(signedUser?.token, directMessage.to);
        setUserInfo(info?.data);
      } else {
        setUserInfo(null);
      }
    };
    getInfo();
    const getConversationId = async () => {
      try { 
        const res = await axiosInstance.post("/conversation", {
          with: directMessage.to,
        });
        console.log(res);
        if(res.data.status === 200 && res.data.conversation){
        const getMessages = await axiosInstance.post('/getprivatemessages',{conversation:res.data.conversation.id});
        setDmessages(getMessages.data.info)
      
      }
      } catch (error) {
        console.log(error)
      }
    };
    getConversationId();
    socket?.off("privatemessage");
    socket?.on("privatemessage", (message) =>{
        console.log("recibido!", message);
      setDmessages((oldOne: any) => [...oldOne, message]);
    }
    );
    return () => {
      socket?.off("privatemessage");
    };
  }, [directMessage]);
  useEffect(() => {
    if (messageScroll.current) {
      const scrollDown = messageScroll.current;
      scrollDown.scrollTop = scrollDown.scrollHeight;
    }
  }, [Dmessages]);
  

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
      <header className="flex relative items-center  justify-center py-3  text-left shadow-[0px_7px_20px_0px_rgba(0,_0,_0,_1)]">
        <span
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOn(!sidebarOn);
          }}
          className={`transition-all ${
            sidebarOn ? "opacity-0" : "opacity-100"
          }  rounded-tr-xl rounded-br-xl   w-10 h-10 flex flex-col items-center justify-center  `}
        >
          <AiOutlineMenu size={25} className="text-zinc-50" />
        </span>
        <div className="flex w-full ml-3 items-center justify-between">
          <h1 className="bg-gradient-to-b flex gap-2 items-center from-neutral-100 via-gray-200 to-neutral-900 bg-clip-text text-transparent font-medium text-xl ">
            <span>
              <AiOutlineMessage className="text-zinc-100/60" />
            </span>{" "}
            Direct message
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
          <PiUsersThreeFill size={25} className="text-zinc-50" />
        </span>
      </header>

      <article
        ref={messageScroll}
        className=" overflow-y-scroll  bg-zinc-800 p-6 pb-32 flex flex-col justify-between custom-scrollbar"
      >
        <div>
          {userInfo && (
            <div className="flex flex-col gap-1 ">
              <img
                className="w-16 h-16  object-cover rounded-sm"
                src={userInfo?.avatar}
                alt="user-image"
              />
              <p className="text-lg font-medium">{userInfo?.name}</p>
              {userInfo?.username}
              {userInfo?.bio}
             
            </div>
          )}
        </div>
        <div className="border-b mt-3 border-zinc-100/40"></div>
        {Dmessages &&
          Dmessages.map((item: any, i: any) => (
            <MessageCard i={i} key={item.id} message={item} />
          ))}
      </article>
      <div className="absolute bottom-8  bg-zinc-800 left-0 w-full mx-auto h-26  ">
        <DirectTextInput emojionprop={emojion} mymessage={setDmessages} />
      </div>
    </section>
  );
}
