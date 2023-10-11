import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import { HiChevronUp, HiChevronDown, HiStatusOnline } from "react-icons/hi";
import { FiChevronRight, FiChevronLeft, FiSearch } from "react-icons/fi";
import getUserInfo from "@/utils/getUserInfo";
import { BiMessageSquareAdd } from "react-icons/bi";
import ChannelCard from "@/components/ChannelCard";
import { channelinfo } from "@/utils/chatInterfaces";
export default function SideBar({
  sideonProp,
  channelProp,
  connectedProp,
  dm,
}: any) {
  const { signedUser, signOut, socket,channelList,channel,setDmOn,dmOn } = useMyContext();
  const [channelSel, setchannelSel] = useState<boolean>(false);
  const [sideon, setsideon] = useState<boolean>(true);
  const [connectedusers, setconnectedusers] = useState<any>(null);
  const [info, setinfo] = useState(true);

  useEffect(() => {
    setsideon(sideonProp);
    
    setconnectedusers(connectedProp);
    
  }, [sideonProp, channelProp, connectedProp, socket]);
  const DmUserInfo = async(id: any) => {
    
    try {
       const res= await getUserInfo(signedUser.token,id);
    if(res?.ok){console.log(dmOn)
      setDmOn({ open: true, to: res.data});
    }
    
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <section
      onClick={() => setsideon(true)}
      className={` flex flex-col  bg-zinc-950/70 transition-all justify-between shadow-2xl   ${
        sideon ? "min-w-[18rem] w-[18rem]" : "min-w-[0rem] w-[0rem]"
      }  overflow-hidden h-full shadow-slate-800 z-50 shadow-xl`}
    >
      <div
        className={`flex justify-between   p-2 z-40  h-16 w-full  bg-zinc-900/90 shadow-bottom items-center text-zinc-200 text-md`}
      >
        
        {sideon ? (
          channelSel ? (
            <>
            <div className="flex items-center justify-between w-full ">
              
              <p className="font-semibold ml-4 min-w-[10rem]">
                {channel.info?.name}
              
              </p>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setchannelSel(false);
                }}
                className="text-slate-200/90 flex items-center justify-center w-6 h-10   font-sans text-lg "
              >
                <FiChevronRight className=" w-full h-full " />
              </span>
            </div></>
          ) : (
            <div className="flex items-center">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setchannelSel(true);
                }}
                className="text-slate-200/90 flex items-center justify-center w-6 h-10   font-sans text-lg "
              >
                <FiChevronLeft className=" w-full h-full " />
              </span>
              <p className="font-semibold ml-4 min-w-[10rem]">All Channels</p>
            </div>
          )
        ) : (
          <div onClick={() => setsideon(true)} className="h-full w-full">
            <FiChevronRight className="m-auto w-6 h-10" />
          </div>
        )}
      </div>

      <div className="flex w-full h-full overflow-hidden">
        <div
          className={`transition-all flex flex-col w-full min-w-full ${
            channelSel ? "flex" : "hidden"
          } h-full p-2  justify-start text-zinc-300 gap-4  overflow-hidden scrollbar-hide`}
        >
          <div className="flex">
            <button
              type="button"
              className="py-2.5 px-4 flex items-center justify-between  w-full  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Create Channel{" "}
              <span>
                <BiMessageSquareAdd size={20} />
              </span>
            </button>
          </div>
          <form className="">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full h-10 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Channels Search"
                required
              />
            </div>
          </form>

          <div className="p-2 font-medium">
            <p>Populares</p>
          </div>
        </div>

        <div
          className={` flex flex-col h-full min-w-full p-1  justify-start text-zinc-300 gap-1 overflow-y-scroll overflow-x-hidden scrollbar-hide`}
        >
          <div className="w-full  text-xl font-semibold p-1">Channels</div>
          {channelList && sideon && 
          channelList?.map((item: any)=>
          <ChannelCard key={item.id}  info={item} />)
          }
          <div className="p-1 ">
            {sideon && (
              <p className="font-semibold flex items-center gap-3 mb-4">
                {" "}
                ONLINE MEMBERS{" "}
                <span>
                  <HiStatusOnline />
                </span>{" "}
                <span className="font-semibold text-amber-200">
                  {" "}
                  {connectedusers && connectedusers.connected.length}
                </span>{" "}
              </p>
            )}
            {connectedusers &&
              connectedusers.connected.map(
                (item: {
                  id: string | undefined;
                  avatar: string;
                  username: string;
                }) => 
                  <div
                    onClick={()=> DmUserInfo(item.id)}
                    key={item.id}
                    className="flex items-center my-3 font-medium"
                  >
                    <img
                      src={item.avatar}
                      alt="avatar"
                      className="w-10 h-10 min-w-[2.5rem] outline outline-1 outline-zinc-200 object-cover rounded-full  shadow-zinc-200/50 shadow-sm"
                    />
                    <p className="ml-5">{item.username}</p>
                  </div>
                
              )}
          </div>
        </div>
      </div>

      <div className="w-full relative flex flex-col justify-between bg-zinc-950  min-h-[3rem] shadow-2xl  p-1 min-w-[200px] ">
        {signedUser ? (
          <div className="w-full h-20 ">
            <div className="flex justify-between text-zinc-300 items-center  h-full w-full">
              <img
                src={signedUser.avatar}
                className="w-10 h-10 min-w-[2.5rem] object-cover rounded-full "
                alt="avatar"
              />
              <p className=" font-medium font-sans drop-shadow-sm ">
                {signedUser.username}
              </p>
              <button
                onClick={() => (info ? setinfo(false) : setinfo(true))}
                className=" text-xl"
              >
                <span>{info ? <HiChevronUp /> : <HiChevronDown />}</span>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className={`text-zinc-50 ${
            info ? "hidden" : "flex"
          } h-[300px] border-4 flex flex-col justify-between p-2 rounded-lg border-zinc-300/30 bg-zinc-950/90 w-full  absolute top-[-300px] left-0 z-50 overflow-hidden`}
        >
          <div
            className={`flex border-2   gap-3 rounded-lg relative border-zinc-400 overflow-hidden  `}
          >
            <img
              src={signedUser.avatar}
              className="w-24 scale-110 rounded-full translate-x-[-20px]  h-24 object-cover"
              alt="me"
            />
            <div className="flex flex-col text-md font-medium justify-around">
              <p>{signedUser.username}</p>
              <p>{signedUser.name}</p>
            </div>
          </div>

          <p>{signedUser.bio}</p>

          <button
            type="button"
            onClick={signOut}
            className="w-full text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
}
