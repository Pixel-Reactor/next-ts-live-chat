import React,{useState,ChangeEvent,useEffect}from 'react'
import { message, channelinfo } from "@/utils/chatInterfaces";
import { useMyContext } from "../context/context";
import { emojis } from "@/utils/emojis";
import { BsFillSendFill, BsEmojiLaughingFill } from "react-icons/bs";
import axios from 'axios'


const DirectTextInput = ({emojionprop}:any) => {
    const { signedUser ,socket, directMessage} = useMyContext();
    const [emojion, setemojion] = useState(false);

    const [message, setmessage] = useState<message>(
      {text: ""});

      const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          "Content-Type": "application/json",
          authorization: signedUser?.token || null,
        },
      });
    
    const HandleChange = ({
        target: { value },
      }: ChangeEvent<HTMLInputElement>) => {
        setmessage({...message, text: value });
      };
      const handleSubmit = async(e: React.SyntheticEvent) => {
        e.preventDefault();
        if(signedUser && socket){ 
        // socket.emit("privatemessage", { from: signedUser.id, message: message,to:directMessage.to});
        const res = await axiosInstance.post('/privatemessage',{message:message,to:directMessage.to});
        
        setmessage({  text: "" });
      
      }
      };
     useEffect(() => {
     setemojion(emojionprop);
     }, [emojionprop])
     
      
  return (
    <div className="h-16 px-3  text-white mb-1 ">
    <form
      onChange={(e) => e.preventDefault()}
      onSubmit={handleSubmit}
      className="flex justify-between shadow-white/10 border border-zinc-50/20 shadow-xl relative z-30 max-w-lg bg-zinc-700/70 items-center p-3 rounded-md w-full  m-auto h-12 "
    >
      <input
        type="text"
        onChange={HandleChange}
        value={message.text}
        maxLength={199}
        className="w-full min-w-[10rem] max-w-full p-2 h-10 border-0 outline-none focus:border-collapse font-semibold text-sm rounded-md bg-transparent"
        placeholder="Write something.."
      />
      <span
        onClick={() =>
          emojion ? setemojion(false) : setemojion(true)
        }
        className="text-zinc-300 m-1 bg-zinc-900/90 p-1 rounded-md w-8 h-8 flex justify-center items-center"
      >
        <BsEmojiLaughingFill />
      </span>
      <span
        onClick={handleSubmit}
        className="text-zinc-300 m-1 bg-zinc-900/90 p-1 rounded-md w-8 h-8 flex justify-center items-center"
      >
        <BsFillSendFill />
      </span>

      <div
        className={`w-full ${
          emojion ? "h-28 border p-1" : "h-0 overflow-y-hidden"
        } bg-slate-950/60  border-zinc-200/40 rounded-md  overflow-y-scroll transition-all flex  flex-wrap justify-center z-0 absolute bottom-[3.3rem] left-0 custom-scrollbar`}
      >
        {emojis.map((item) => (
          <span
            className="flex items-center  select-none transition-all hover:scale-150 justify-center w-10 h-10 bg-transparent"
            key={item}
            onClick={(e) => {
              e.preventDefault();
              setmessage({
                ...message,
                text: message.text + item,
              });
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </form>
  </div>
  )
}

export default DirectTextInput
