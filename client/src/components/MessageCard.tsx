import React from 'react'
import { useMyContext } from "../context/context";
import { space } from 'postcss/lib/list';

interface message{
    text:string,
    date:string,
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
  }
  
  const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
    const PrintDate = ()=>{
      const now :Date= new Date()
      const date:Date = new Date(message.date);
      const Diff:number = date.getTime() - now.getTime();
      const daysDiff: number =(Math.round(Diff / (1000 * 60 * 60 * 24)))* -1;
      if(daysDiff < 1){
        return <span>today</span>
      }else if(daysDiff === 1){
        return <span>yesterday</span>
      }
      return <span className='text-zinc-300'>{daysDiff} {daysDiff > 1? 'days' : 'day'} ago</span>
    }

    return (
      <div className='max-w-lg  h-full flex text-md  rounded-lg'>
        <div className='flex  w-full items-center h-full  '>
        <div> 
        <img src={message.sender.avatar} 
        className='w-8 h-8 min-w-[2rem]  object-cover rounded-md' alt="sender" />
        </div>
        <div className='ml-6 flex flex-col'>
          <div className='flex gap-2'>
             <p className='text-zinc-400 '>{message.sender.username}</p> 
             <p className='text-xs flex items-center'>{PrintDate()}</p> 
             </div>
           
            <p className='text-zinc-200 font-normal'>{message.text}</p>
            </div>
        </div>
      
      </div>
    );
  };
  
  export default MessageCard;

  
  
  
