import {
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  useEffect,
} from "react";
import { Socket } from "socket.io-client"; // Import the appropriate type for your socket library

interface MyContextData {
  signedUser: {
    bio: string;
    token: string;
    id: string;
    avatar: string;
    username: string;
    name: string;
  } | null;
  channelIn: any;
  setSignedUser: React.Dispatch<React.SetStateAction<any>>;
  setSocket: React.Dispatch<React.SetStateAction<any>>;
  setChannelIn: React.Dispatch<React.SetStateAction<any>>;
  setSidebarOn: React.Dispatch<React.SetStateAction<boolean>>;
  setFriendsOn: React.Dispatch<React.SetStateAction<boolean>>;
  setDirectMessage:React.Dispatch<React.SetStateAction<any>>;
  directMessage:{on:boolean,to:string | null}
  sidebarOn: boolean;
  friendsOn: boolean;
  signOut: () => void;
  socket: Socket | null;
  errormsg:{on:boolean,msg:string};
  setErrormsg:React.Dispatch<React.SetStateAction<any>>
}

const MyContext = createContext<MyContextData | undefined>(undefined);

export function MyContextProvider({ children }: { children: ReactNode }) {
  const [signedUser, setSignedUser] = useState(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [channelIn, setChannelIn] = useState(null);
  const [sidebarOn, setSidebarOn] = useState<boolean>(true);
  const [friendsOn, setFriendsOn] = useState<boolean>(false);
  const [directMessage, setDirectMessage] = useState({on:false,to:null});
  const [errormsg, setErrormsg] = useState({on:false,msg:''})

  const signOut = () => {
    if (socket) {
      socket.emit("logout");
      setSocket(null);
      setChannelIn(null);
    }
    setSignedUser(null);
  };
  useEffect(() => {
    if (!signedUser) {
      setSocket(null);
      setChannelIn(null);
    }
  }, [signedUser]);
  useEffect(() => {
  setDirectMessage({on:false,to:null})
  }, [channelIn])
  

  return (
    <MyContext.Provider
      value={{
        signedUser,
        setSignedUser,
        signOut,
        socket,
        setSocket,
        setChannelIn,
        channelIn,
        sidebarOn,
        setSidebarOn,
        friendsOn,
        setFriendsOn,
        directMessage,
        setDirectMessage,
        setErrormsg,
        errormsg
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
