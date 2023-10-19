import React from 'react'
import { useMyContext } from "../context/context";
import { space } from 'postcss/lib/list';

interface message{
    text:string,
    date:string,
    created_at:string,
    sender:{
        avatar:string,
        bio:string|null,
        id:string,
        name:string,
        username:string
    },
   
}

interface MessageCardProps {
    message: message;
    i:number
  }
  
  const MessageCard: React.FC<MessageCardProps> = ({ message,i }) => {
    const PrintDate = ()=>{
      const now :Date= new Date()
      const date:Date = new Date(message.date|| message.created_at);
      const Diff:number = date.getTime() - now.getTime();
      const daysDiff: number =(Math.round(Diff / (1000 * 60 * 60 * 24))) * -1;
      const hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
      const minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();

      if(daysDiff < 1){
        return <span>today {hour}:{minutes}</span>
      }else if(daysDiff === 1){
        return <span>yesterday {hour}:{minutes}</span>
      }
      return <span className='text-zinc-300'>{daysDiff} {daysDiff > 1? 'days' : 'day'} ago {hour}:{minutes}</span>
    }

    return (
      <div className={`max-w-lg  h-full flex text-md  rounded-lg animate-fade-in delay-200 animation-delay-[${i*10}ms]`}>
        <div className='flex  w-full items-center h-full  '>
        <div className=''> 
        <img src={message.sender.avatar} 
        className='w-10 h-10 min-w-[2.5rem]  object-cover rounded-md' alt="sender" />
        </div>
        <div className='ml-6 flex flex-col p-1'>
          <div className='flex gap-2'>
             <p className='text-zinc-400 '>{message.sender.username}</p> 
             <p className='text-xs flex items-center'>{PrintDate()}</p> 
             </div>
           
            <p className='text-zinc-100/90 font-normal'>{message.text}</p>
            </div>
        </div>
      
      </div>
    );
  };
  
  export default MessageCard;

  
  
  
