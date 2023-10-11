import React,{useState,ChangeEvent,useEffect}from 'react'
import { message, channelinfo } from "@/utils/chatInterfaces";
import { useMyContext } from "../context/context";
import { emojis } from "@/utils/emojis";
import { BsFillSendFill, BsEmojiLaughingFill } from "react-icons/bs";



const TextInput = ({emojionprop,channelsel}:any) => {
    const { signedUser ,socket,channelIn} = useMyContext();
    const [emojion, setemojion] = useState(false);

    const [message, setmessage] = useState<message>(
      {text: ""});
    const HandleChange = ({
        target: { value },
      }: ChangeEvent<HTMLInputElement>) => {
        setmessage({...message, text: value });
      };
      const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if(signedUser){ 
        socket.emit("sendmessage", { from: signedUser.id, message: message,channel:channelIn });
       
        setmessage({  text: "" });}
       
      };
     useEffect(() => {
     setemojion(emojionprop)
     }, [emojionprop])
     
      
  return (
    <div className="h-16 px-3  text-white mb-1">
    <form
      onChange={(e) => e.preventDefault()}
      onSubmit={handleSubmit}
      className="flex justify-between relative z-50 max-w-xl bg-zinc-700/70 items-center p-3 rounded-md w-full  m-auto h-12 "
    >
      <input
        type="text"
        onChange={HandleChange}
        value={message.text}
        maxLength={199}
        className="w-full min-w-[20rem] max-w-full p-2 h-10 border-0 outline-none focus:border-collapse font-semibold text-sm rounded-md bg-transparent"
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
          emojion ? "h-28 border" : "h-0 overflow-y-hidden"
        } bg-slate-950/60  border-zinc-200/40 rounded-md overflow-y-scroll transition-all flex  flex-wrap justify-center z-0 absolute bottom-[3.3rem] left-0 custom-scrollbar`}
      >
        {emojis.map((item) => (
          <span
            className="flex items-center select-none justify-center w-10 h-10 bg-transparent"
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

export default TextInput
