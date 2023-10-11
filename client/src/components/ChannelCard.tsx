import React from 'react'
import { useMyContext } from "../context/context";

interface ChannelCardProps {
   info: any;
 
  }
  
  const ChannelCard: React.FC<ChannelCardProps> = ({ info}) => {
   
 const {setChannel,setDmOn,channel}= useMyContext();
 
    return (
      <div
      key={info.id}
      onClick={()=>{
        setChannel(info);
        setDmOn({open:false,to:''});}} 
      className={`w-full ${channel.id === info.id ? 'bg-amber-700/60': 'bg-slate-900/80'} border border-zinc-500/70 transition-all justify-center text-zinc-300/60 hover:text-black hover:bg-zinc-100/80 rounded-md flex flex-col px-4 py-2 max-h-44 min-w-[6rem] overflow-hidden `}>
        <p className=' text-sm font-semibold  h-full flex items-center '>{info.name} Channel</p>
        
        </div>
    );
  };
  
  export default ChannelCard;

  
  
  
