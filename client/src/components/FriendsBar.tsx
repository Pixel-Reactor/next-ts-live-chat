import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import { PiTelevisionSimpleLight, PiPlugsConnectedFill } from "react-icons/pi";
import { PiUsersThreeFill } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";

export default function FriendsBar({}) {
  const {
    socket,
    sidebarOn,
    setSidebarOn,
    setDirectMessage,
    friendsOn,
    signedUser,
    setFriendsOn,
  } = useMyContext();

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      authorization: signedUser?.token || null,
    },
  });
  const [conversations, setconversations] = useState<any>(null);
  const [connected, setconnected] = useState<any>(null);
  const handleConnectedUsers = (users: any) => {
    setconnected(users);
  };

  const getConversations = async () => {
    const res = await axiosInstance.get("conversations");

    console.log(res);
    setconversations(res.data.list);
  };

  useEffect(() => {
    if (socket) {
      socket.off("users");
      socket.on("users", handleConnectedUsers);
      socket.off("conversationupd");
      socket.on("conversationupd", getConversations);
    }
    return () => {};
  }, [socket]);

  const DmUserInfo = async (id: any) => {
    setDirectMessage({ on: true, to: id });
    setFriendsOn(!friendsOn);
  };
  useEffect(() => {
    if (signedUser) {
      try {
        getConversations();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <section
      className={` transition-all ${
        friendsOn ? "w-full max-w-xs " : "max-w-0 w-0"
      } overflow-hidden z-50 bg-zinc-900 h-screen min-h-[700px]  shadow-xl shadow-white/60 absolute right-0 top-0 `}
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
        <h2 className="flex items-center p-3 gap-2 pt-6 text-lg font-semibold ">
          {" "}
           <PiUsersThreeFill />Online <span className="ml-3">{connected && connected.connected.length}</span>
        </h2>
        <div className="p-3 custom-scrollbar max-h-[300px]  overflow-y-scroll">
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
                  <div className="flex items-center gap-2"> <img
                    src={item.info.avatar}
                    alt="avatar"
                    className="w-10 h-10 min-w-[2.5rem] outline outline-1 outline-zinc-200 object-cover rounded-full  shadow-zinc-200/50 shadow-sm"
                  />
                  <p>{item.info.username}</p></div>
                 
                  <div className=" flex  gap-3  justify-end  items-center ">
                    
                    <p className="flex items-center gap-3">
                      <span>
                        <PiTelevisionSimpleLight size={25} />{" "}
                      </span>
                      {item.channel?.name ?? ""}
                    </p>
                  </div>
                </div>
              )
            )}
        </div>
        <h2 className="flex items-center p-3  gap-2 text-lg font-semibold ">
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
                    className="w-8 h-8  rounded-full object-cover"
                    alt="userpicture"
                  />
                  <p>{item.with.username}</p>
                </div>
              ))
            : "There are no conversation started. "}
        </div>
      </div>
    </section>
  );
}
