import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import getMessages from "@/utils/getMessages";
import { useRouter } from "next/router";
import io from "socket.io-client";
import MessageCard from "../components/MessageCard";
import { MdMenuOpen, MdNotifications } from "react-icons/md";
import Image from "next/image";
import SideBar from "@/components/SideBar";
import TextInput from "@/components/TextInput";

export default function Home() {
  const [emojion, setemojion] = useState(false);
  const {
    signedUser,
    socket,
    setSocket,
    setChannelList,
    channel,
    setChannel,
    dmOn,
    setDmOn,
    messages,
    setMessages,
    setNewMessages,
  } = useMyContext();

  const [sideon, setsideon] = useState<boolean>(true);
  const [connectedusers, setconnectedusers] = useState<any>(null);
  const lastElementRef = useRef<null | HTMLDivElement>(null);
  const [channelSel, setchannelSel] = useState(null)
  const router = useRouter();
  const messagesBox = useRef(null);

  useEffect(() => {
    if (signedUser.token) {
      const socketConn = io(`${process.env.NEXT_PUBLIC_API_URL}`);
      setSocket(socketConn);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      const Get = async () => {
        const res: any = await getMessages(signedUser.token, channel.id);
        if (res.status === 200) {
          setMessages(res.data);
        } else {
          console.log(res);
        }
      };
      Get();
    }
    setchannelSel(channel) 
    console.log('çhange channel')
  
  }, [channel, socket]);

  const HandleMessage =(message:any) => {
    console.log(channel.id,message.channel)
    if (message.channel === channel.id) {
      setMessages((oldOne: any) => [...oldOne, message]);
    }
  }
  useEffect(() => {
    
    if (socket) {
      socket.on("connect", () => {
        try {
          console.log("connected");

          socket.emit("id", signedUser.id);

          const handleConnectedUsers = (users: any) => {
            setconnectedusers(users);
          };

          socket.on("users", handleConnectedUsers);
          socket.on("allchannels", (list: any) => setChannelList(list.list));

          socket.on("newmessage",HandleMessage );
          socket.on("error", (error: any) => {
            console.error("Error en la conexión de Socket.io:", error);
          });
        } catch (error) {
          console.log(error);
        }

        return () => {
          socket.off("newmessage");
          socket.emit("logout");
          socket.disconnect();
        };
      });
    }
  }, [socket]);

  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "end",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!signedUser.token) {
      router.push("/");
      return;
    }
  }, [signedUser]);

 
  return (
    <main className="select-none overflow-hidden  bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-zinc-900 min-h-screen h-screen ">
      <div className="bg-[url('../svg/blurry.svg')]   w-full min-h-screen h-screen  bg-no-repeat bg-cover bg-center flex justify-start items-center flex-col ">
        <div className="bg-zinc-900/90 z-50 w-full h-16">
          <h1 className="p-3 px-6 w-full text-center  bg-zinc-900/90 flex  drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)] bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]  from-orange-800 via-amber-100 to-orange-900 text-3xl font-bold  tracking-normal ">
            <span className="text-left flex items-center justify-center">
              D
              <Image
                className="m-0 w-auto h-auto translate-y-[2px]"
                src="/donut.png"
                width={15}
                height={15}
                alt="donut"
              />
              nut-Chat
            </span>
          </h1>
        </div>
        <div className="bg-zinc-900/90 w-full text-zinc-50 flex justify-center items-center">
          <MdNotifications size={20} />
        </div>
        <div
          className={`w-full h-full flex flex-row justify-start    overflow-x-hidden`}
        >
          <SideBar
            socket={socket}
            sideonProp={sideon}
            connectedProp={connectedusers}
          />

          <section
            onClick={() => {
              setsideon(false);
            }}
            className={`w-full min-w-[300px] flex flex-col justify-between transition-all bg-zinc-900/90 ${
              sideon && "scale-[0.98] "
            } h-full`}
          >
            {dmOn.open ? (
              <>
                <div className="flex p-2 font-semibold shadow-bottom h-14 min-h-[3.5rem] w-full bg-zinc-900  items-center text-zinc-200 text-md">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setsideon(true);
                    }}
                    className="m-2"
                  >
                    <MdMenuOpen size={25} />
                  </div>
                  <p>Direct Message</p>
                </div>
                <div className="w-full font-semibold flex flex-col p-6 text-zinc-50 border-b border-zinc-50">
                  <div
                    className={`flex border-2   gap-3 rounded-lg relative border-zinc-400 overflow-hidden  `}
                  >
                    <img
                      src={dmOn.to.avatar}
                      className="w-24 scale-110 rounded-full translate-x-[-20px]  h-24 object-cover"
                      alt="me"
                    />
                    <div className="flex flex-col text-md font-medium justify-around">
                      <p>{dmOn.to.username}</p>
                      <p>{dmOn.to.name}</p>
                    </div>
                    <p>{dmOn.to.bio}</p>
                  </div>
                </div>
                <div
                  onClick={() => setemojion(false)}
                  ref={messagesBox}
                  className="text-white h-full font-semibold flex flex-col justify-start  p-4 gap-3 overflow-scroll custom-scrollbar "
                >
                  {messages
                    ? messages?.map((item: any) => (
                       
                          <div key={item.id}>
                            <MessageCard  message={item} />
                            <div
                              className="h-0 "
                              ref={lastElementRef || null}
                            ></div>
                          </div>
                       
                      ))
                    : "no hay "}
                </div>
              </>
            ) : (
              <>
                <div className="flex p-2 shadow-bottom h-14 min-h-[3.5rem] w-full bg-zinc-900  items-center text-zinc-200 text-md">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setsideon(true);
                    }}
                    className="m-2"
                  >
                    <MdMenuOpen size={25} />
                  </div>
                  <img src="./donut.png" alt="donut" className="w-6 h-6" />
                  <p className="font-semibold ml-3 flex items-center">
                    {channel.name} &#128053; &#128507; Channel
                  </p>
                </div>
                <div
                  onClick={() => setemojion(false)}
                  ref={messagesBox}
                  className="text-white h-full font-semibold flex flex-col justify-start  p-4 gap-3 overflow-scroll custom-scrollbar "
                >
                  {messages
                    ? messages.map((item: any) => (
                        <>
                          <div key={item.id}>
                            <MessageCard message={item} />
                            <div
                              className="h-0 "
                              ref={lastElementRef || null}
                            ></div>
                          </div>
                        </>
                      ))
                    : "no hay"}
                </div>
              </>
            )}
            <div>
              <TextInput emojionprop={emojion} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
