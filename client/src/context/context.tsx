import {
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  useEffect,
} from "react";
import { Socket } from "socket.io-client";

export interface ConversationType {
  conversation_id: string;
  new: number;
  id: string;
  with: {
    avatar: string;
    id: string;
    username: string;
    bio: string;
    name: string;
  };
}

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
  setSignedUser: React.Dispatch<SetStateAction<any>>;
  setSocket: React.Dispatch<SetStateAction<any>>;
  setChannelIn: React.Dispatch<SetStateAction<any>>;
  setSidebarOn: React.Dispatch<SetStateAction<boolean>>;
  setFriendsOn: React.Dispatch<SetStateAction<boolean>>;
  setDirectMessage: React.Dispatch<SetStateAction<any>>;
  directMessage: {
    on: boolean;
    to: string | null;
    conversationId: string | null;
  };
  sidebarOn: boolean;
  friendsOn: boolean;
  signOut: () => void;
  socket: Socket | null;
  errormsg: { on: boolean; msg: string };
  setErrormsg: React.Dispatch<SetStateAction<any>>;
  conversations: ConversationType[] | null;
  setConversations: React.Dispatch<SetStateAction<ConversationType[] | null>>;
  notification: {
    conversation_id: string;
    created_at: string;
    id: string;
    sender: {
      avatar: string;
      id: string;
      username: string;
    };
    text: string;
  } | null;
  setNotification: React.Dispatch<SetStateAction<{
    conversation_id: string;
    created_at: string;
    id: string;
    sender: {
      avatar: string;
      id: string;
      username: string;
    };
    text: string;
  } | null>>
}
const MyContext = createContext<MyContextData | undefined>(undefined);

export function MyContextProvider({ children }: { children: ReactNode }) {
  const [signedUser, setSignedUser] = useState<MyContextData['signedUser'] | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<ConversationType[] | null>(null);
  const [channelIn, setChannelIn] = useState(null);
  const [sidebarOn, setSidebarOn] = useState<boolean>(true);
  const [friendsOn, setFriendsOn] = useState<boolean>(false);
  const [directMessage, setDirectMessage] = useState<MyContextData['directMessage']>({
    on: false,
    to: null,
    conversationId: null,
  });
  const [errormsg, setErrormsg] = useState<MyContextData['errormsg']>({ on: false, msg: "" });
  const [notification, setNotification] = useState<MyContextData['notification'] | null>(null);

  const signOut = () => {
    if (socket) {
      socket.emit("logout");
      setSocket(null);
      setChannelIn(null);
    }
    setSignedUser(null);
  }

  useEffect(() => {
    if (!signedUser) {
      setSocket(null);
      setChannelIn(null);
    }
  }, [signedUser]);

  useEffect(() => {
    setDirectMessage({ on: false, to: null, conversationId: null });
  }, [channelIn]);

  useEffect(() => {
    if (notification && conversations) {
      const newarray = conversations?.map((item: ConversationType) => {
        if (item.conversation_id === notification.conversation_id) {
          if (item.with.id !== directMessage.to) {
            const add = item.new + 1;
            return { ...item, new: add };
          }
        }
        return item;
      });
      setConversations(newarray);
      setNotification(null);
    }
  }, [notification]);

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
        errormsg,
        conversations,
        setConversations: (newValue) => setConversations(newValue as ConversationType[] | null),
        notification,
        setNotification,
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
