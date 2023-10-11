import {
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  useEffect,
} from "react";
interface MyContextData {
  signedUser: {
    bio: ReactNode;
    token: string;
    id: string;
    avatar: string;
    username: string;
    name: string;
  };
  setSignedUser: React.Dispatch<React.SetStateAction<any>>;
  setSocket: React.Dispatch<React.SetStateAction<any>>;
  signOut: () => void;
  socket: any;
  channel:any;
  channelList:any;
  setChannelList:React.Dispatch<React.SetStateAction<any>>;
  setChannel:React.Dispatch<React.SetStateAction<any>>
  dmOn:any;
  setDmOn:any;
  messages:any;
  setMessages:any;
  setNewMessages:(message:any)=>void
}

const MyContext = createContext<MyContextData | undefined>(undefined);

export function MyContextProvider({ children }: { children: ReactNode }) {
  const [signedUser, setSignedUser] = useState({token: "",id: "",avatar: "",username: "",name: "",bio: ""});
  const [socket, setSocket] = useState<any>(null);
  const [dmOn,setDmOn] = useState({open:false,to:null})

  const [channelList, setChannelList] = useState<any>(null)
  const [channel, setChannel] = useState({id: "default",info: null});
  const [messages, setMessages] = useState<any>([]);

  const signOut = () => {
    setSignedUser({
      token: "",
      id: "",
      avatar: "",
      username: "",
      name: "",
      bio: "",
    });
  };


 const setNewMessages = (message: any) => {
  console.log("message", message.channel);
  console.log('front',channel.id)

  if (message.channel === channel.id){
    setMessages((oldOne: any) => [...oldOne, message]);
  }
};

  useEffect(() => {
    if (!signedUser.token && socket) {
      socket.emit("logout");
      socket.disconnect();
      setSocket(null);
    }
  }, [signedUser.token]);

 useEffect(() => {
if(socket){
  socket.emit('changechannel',channel.id)
}
console.log('channel changed to ',channel.id)
 }, [channel])
 
useEffect(() => {

  console.log('channel list initalizae')
 if(channelList){
  console.log(channelList)
 }
}, [])

  return (
    <MyContext.Provider
      value={{
        signedUser,
        setSignedUser,
        signOut,
        socket,
        setSocket,
        channelList,
        setChannelList,
        channel,
        setChannel,
        dmOn,
        setDmOn,
        messages,
        setMessages,
        setNewMessages
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext has to be used inside MyContext provider");
  }
  return context;
}
