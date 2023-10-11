import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import { HiChevronUp, HiChevronDown, HiStatusOnline } from "react-icons/hi";
import { FiChevronRight, FiChevronLeft, FiSearch } from "react-icons/fi";
import { BsFillDoorClosedFill } from "react-icons/bs";
import getUserInfo from "@/utils/getUserInfo";
import { BiMessageSquareAdd } from "react-icons/bi";

export default function SideBar({}) {
  const { signedUser, signOut, socket, setChannelIn, channelIn } =
    useMyContext();
  const [allchannels, setAllchannels] = useState();

  useEffect(() => {
    if (socket) {
      socket.on("allchannels", (channelslist: any) => {
        setAllchannels(channelslist.list);
      });
    }
  }, [socket]);
  useEffect(() => {
    if(channelIn){
       console.log("channel in from sidebar", channelIn.id);
    }
  }, [channelIn]);

  return (
    <section className={`min-w-[250px] bg-slate-950/90`}>
      <div className="flex flex-col p-3 gap-2">
        <h1 className="font-medium p-2">All Channels</h1>
        <div className="flex flex-col gap-1 text-zinc-50">
          {" "}
          {allchannels?.map((item: any) => (
            <p
              onClick={() => setChannelIn(item)}
              className={`w-full ${
                channelIn?.id === item.id ? "bg-zinc-300/20" : "" ?? ""
              } border border-zinc-50/10 p-2 hover:bg-zinc-300/10 rounded-sm font-medium text-sm flex items-center gap-2`}
            >
              <BsFillDoorClosedFill className="text-cyan-700/70" />
              {item.name} Channel
            </p>
          )) ?? "cargando "}
        </div>
      </div>
    </section>
  );
}
