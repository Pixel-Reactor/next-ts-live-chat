import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import { PiTelevisionSimpleLight, PiPlugsConnectedFill } from "react-icons/pi";
import { PiUsersThreeFill } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { ConversationType } from "../context/context";
export default function FriendsBar({}) {
  const {
    socket,
    sidebarOn,
    setSidebarOn,
    setDirectMessage,
    friendsOn,
    signedUser,
    directMessage,
    setChannelIn,
    setFriendsOn,
    conversations,
    setConversations,
    notification,
    setNotification,
  } = useMyContext();

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      authorization: signedUser?.token || null,
    },
  });
  const [connected, setconnected] = useState<any>(null);
  const handleConnectedUsers = (users: any) => {
    setconnected(users);
  };
  useEffect(() => {
    if (signedUser) {
      try {
        getConversations();
      } catch (error) {
      }
    }
    return () => {
      return;
    };
  }, []);

  const getConversations = async () => {
    const res = await axiosInstance.get("/conversations");
    setConversations(res.data.list);
  };

  useEffect(() => {
    if (socket) {
      console.log("mounted");
      socket.on("users", handleConnectedUsers);
      socket.on("conversationupd", getConversations);
    }
    return () => {
      if (socket) {
        socket.off("conversationupd");
        socket.off("users");
      }
    };
  }, [socket]);

  const DmUserInfo = async (id: any) => {
    setDirectMessage({ on: true, to: id });

    setFriendsOn(!friendsOn);

  
    const newlist = conversations?.map((item) => {
      if (directMessage.to === item.with.id) {
        return { ...item, new: 0 };
      }
      return item;
    }) as ConversationType[]; 
    
    setConversations(newlist);

  }

  return (
    <section
      className={` transition-all ${
        friendsOn ? "w-full max-w-xs " : "max-w-0 w-0"
      } overflow-hidden z-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-zinc-950 h-screen min-h-[700px]  shadow-xl shadow-white/60 absolute right-0 top-0 `}
    >
     
      <div className="flex  flex-col relative h-full shadow-inner shadow-black  gap-2">
        <span
          onClick={() => setFriendsOn(!friendsOn)}
          className=" z-30 rounded-md w-10 h-10 absolute top-3 right-3 justify-center flex  bg-slate-950/90 items-center"
        >
          <>
            <AiOutlineClose size={18} className="text-zinc-50" />
          </>
        </span>
        <h2 className="flex items-center gap-2  bg-gradient-to-b from-neutral-100 via-gray-200 to-neutral-900 bg-clip-text text-transparent px-0 py-5 border-b mx-5 border-zinc-50/20 justify-start text-lg font-semibold ">
          {" "}
          <PiUsersThreeFill className='text-zinc-50'/>
          Online{" "}
          <span className="ml-3">
            {connected && connected.connected.length}
          </span>
        </h2>
        <div className="p-3 custom-scrollbar max-h-[300px] overflow-x-hidden  overflow-y-scroll">
          {connected &&
            connected.connected.map(
              (item: {
                info: {
                  id: string | undefined;
                  avatar: string;
                  username: string;
                };
                socketId: string;
                channel: {
                  name: string;
                  channel: string;
                };
              }) => (
                <div
                  onClick={() => DmUserInfo(item.info.id)}
                  key={item.info.id}
                  className="flex items-center justify-between  gap-2 my-3 font-medium text-lg"
                >
                  <div className="flex items-center gap-2">
                    {" "}
                    <img
                      src={item.info.avatar}
                      alt="avatar"
                      className="w-8 h-8 min-w-[2rem] outline outline-1 outline-zinc-50/20 object-cover rounded-full  shadow-zinc-200/50 shadow-sm"
                    />
                    <p>{item.info.username}</p>
                  </div>

                  <div className=" flex  gap-3  justify-end  items-center ">
                    <p className="flex items-center gap-1">
                      <span>
                        <PiTelevisionSimpleLight size={22} />{" "}
                      </span>
                      <p className="text-sm">{item.channel?.name ?? ""}</p>
                    </p>
                  </div>
                </div>
              )
            )}
        </div>
        <h2 className="flex items-center p-2 px-0 py-5 border-b mx-5 border-zinc-50/20 justify-start gap-2 text-lg font-semibold ">
          {" "}
          Conversations <PiUsersThreeFill />
        </h2>
        <div className="p-3 custom-scrollbar flex flex-col gap-3  max-h-[400px] overflow-y-scroll">
          {conversations
            ? conversations.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => DmUserInfo(item.with.id)}
                  className="text-zinc-50 flex items-center gap-2"
                >
                  <img
                    src={item.with.avatar}
                    className="w-8 h-8 min-w-[2rem] outline outline-zinc-50/20 rounded-full object-cover"
                    alt="userpicture"
                  />
                  <p>{item.with.username}</p>
                  {item.new > 0 && (
                    <p className="p-1 px-2  h-6 flex text- items-center justify-center rounded-md font-medium bg-sky-700">
                      {item.new}
                    </p>
                  )}
                </div>
              ))
            : "There are no conversation started. "}
        </div>
      </div>
    </section>
  );
}
