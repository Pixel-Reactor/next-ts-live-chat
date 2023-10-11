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
    bio: string;
    token: string;
    id: string;
    avatar: string;
    username: string;
    name: string;
  } | null;
  channelIn:any;
  setSignedUser: React.Dispatch<React.SetStateAction<any>>;
  setSocket: React.Dispatch<React.SetStateAction<any>>;
  setChannelIn: React.Dispatch<React.SetStateAction<any>>;
  signOut:()=>void
  socket:any
}

const MyContext = createContext<MyContextData | undefined>(undefined);

export function MyContextProvider({ children }: { children: ReactNode }) {

  const [signedUser, setSignedUser] = useState(null);
  const [socket, setSocket] = useState<any>(null);
  const [channelIn, setChannelIn] = useState(null);


  const signOut = () => {
    setSignedUser(null);
  };

  
  return (
    <MyContext.Provider
      value={{
        signedUser,
        setSignedUser,
        signOut,
        socket,
        setSocket,
        setChannelIn,
        channelIn
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
