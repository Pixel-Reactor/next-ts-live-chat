import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import { PiTelevisionSimpleLight, PiPlugsConnectedFill } from "react-icons/pi";
import { AiOutlinePlus, AiOutlineStar } from "react-icons/ai";
import {BsChevronUp,BsChevronDown} from 'react-icons/bs'
import { AiOutlineClose } from "react-icons/ai";
import { CiSearch,CiSaveDown1 } from "react-icons/ci";
import axios from "axios";
export default function SideBar({}) {
  interface src {
    on: boolean;
    text: string;
    data: [] | null;
  }
  const {
    signedUser,
    signOut,
    socket,
    setChannelIn,
    channelIn,
    sidebarOn,
    setSidebarOn,
    setErrormsg,
    setDirectMessage,
    directMessage
  } = useMyContext();
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      authorization: signedUser?.token || null,
    },
  });
  const [allchannels, setAllchannels] = useState<
    { save_id: string; channel_id: string; channel_name: string,channel_description:string }[] | null
  >(null);
  const [popular, setPopular] = useState<
    {
      channel_description: string; quantity: number; channel_id: string; channel_name: string 
}[] | null
  >(null);
  const [info, setinfo] = useState(true);
  const [create, setcreate] = useState(false);
  const [createForm, setcreateForm] = useState<any>();
  const [loading, setloading] = useState(false);
  const [srctext, setsrctext] = useState("");
  const [src, setsrc] = useState<src>({ on: false, text: "", data: null });

  useEffect(() => {
    if (socket) {
      socket.on("savedchannels", (channelslist: any) => {
        setAllchannels(channelslist.list);
      });
      socket.on("popularchannels", (channelslist: any) => {
        setPopular(channelslist);
      });
    }
  }, [socket]);

  const handleCreateChange = (e: any) => {
    setcreateForm({
      ...createForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleCreateSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (loading) {
        return;
      }
      setloading(true);
      const res = await axiosInstance.post("/createchannel", createForm);

      if (res && res.data.status === 200) {
        setloading(false);
        setcreate(false);
        setErrormsg({ on: true, msg: "Your channel has been created!" });
      } else {
        setloading(false);
        setErrormsg({ on: true, msg: res.data.message });
      }
    } catch (error) {
    }
  };

  const HandleSrcChange = async (e: any) => {
    e.preventDefault();

    const { value } = e.target;

    setsrctext(value);

    if (value.length < 2 || loading) {
      setsrc({ ...src, on: false });
      return;
    }
    try {
      setloading(true);
      const res = await axiosInstance.post("/channelsrc", { src: srctext });
      if (res) {
        setloading(false);
        setsrc({ ...src, on: true, data: res.data.data });
      }
    } catch (error) {
     
    }
  };
  const HandleAddChannel = async (channel: { id: string; name: string ,description:string}) => {
    try {
      if (signedUser && signedUser.id) {
        const res = await axiosInstance.post("/savechannel", {
          user: signedUser.id,
          channel: channel,
        });

        setsrctext("");
        setsrc({ ...src, on: false });
      }
    } catch (error) {
    }
  };
  const HandleRemove = async (savedchannel: string) => {
    try {
      if (signedUser && signedUser.id) {
        const res = await axiosInstance.post("/removechannel", {
          user: signedUser.id,
          save_id: savedchannel,
        });
      }
    } catch (error) {
    }
  };
  const HandleJoin = async (channel: {
    channel_id: string;
    channel_name: string;
    save_id: string;
    channel_description: string;
  }) => {
    setChannelIn(channel);
    setSidebarOn(false);
    setDirectMessage({...directMessage,on:false})
    if (socket) {
      socket.emit("changechannel", {
        channel: channel.channel_id,
        name: channel.channel_name,
      });
    }
  };
  return (
    <section
      className={` transition-all ${
        sidebarOn ? "w-full max-w-xs " : "max-w-0 w-0"
      } overflow-hidden bg-zinc-900 h-screen min-h-[700px] shadow-xl shadow-white/60 absolute left-0 top-0 z-40 `}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setsrc({ ...src, on: false });
          setcreate(false);
        }}
        className="flex flex-col relative h-full   gap-2"
      >
        <div className="flex flex-col bg-zinc-900 min-h-[180px] p-2 ">
          <div className="flex justify-between  mb-3  z-50 text-left ">
            <h1 className=" w-full p-3 py-5  border-b border-zinc-50/20 text-left  bg-gradient-to-b from-neutral-100 via-gray-200 to-neutral-900 bg-clip-text text-transparent font-bold text-lg ">
              All Channels
            </h1>
            <span
              onClick={() => setSidebarOn(!sidebarOn)}
              className=" z-30 rounded-md  h-10 w-10 justify-center flex  bg-slate-950/90 items-center"
            >
              <>
                <AiOutlineClose size={18} className="text-zinc-50" />
              </>
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setcreate(!create);
            }}
            className={`${
              create ? "" : ""
            }min-h-10 relative mx-2 max-w-xl inline-flex items-center  justify-center p-0.5 mb-2 mr-2 overflow-hidden overflow-y-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800`}
          >
            <span className="relative px-5 py-2.5 flex item-center justify-center gap-3 transition-all ease-in duration-75 w-full bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Create channel
              <AiOutlinePlus size={17} />
            </span>
          </button>
          <div className={`${create ? "h-0 overflow-hidden" : "h-10 px-2"}`}>
            <form className="h-10 max-w-xl">
              <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CiSearch size={20} />
                </div>
                <input
                  type="search"
                  onChange={HandleSrcChange}
                  value={srctext}
                  min={3}
                  className="block w-full h-10 p-4 pl-16 text-sm text-gray-900 border border-gray-300 rounded-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                />
                <button
                  type="submit"
                  onClick={HandleSrcChange}
                  className="text-white absolute right-0.5 bottom-0.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
                {src.on ? (
                  <div className="absolute  border border-zinc-50/40 w-full shadow-zinc-300/20 shadow-inner  bg-zinc-900 z-50">
                    <ul>
                      {src.data ? (
                        src.data?.map((item: any) => (
                          <li
                            onClick={() => {
                              HandleAddChannel(item);
                            }}
                            className="h-10  p-3 hover:bg-zinc-300/10 max-h-64  font-medium  text-lg flex items-center gap-2"
                            key={item.id}
                          >
                            {item.name}
                          </li>
                        ))
                      ) : (
                        <li className="h-10  p-3 max-h-64  font-medium  text-lg flex items-center gap-2">
                          Nothing found.{" "}
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </form>
          </div>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex relative  flex-col gap-2 text-zinc-50  "
        >
          {create && (
            <div className="w-full min-h-full p-3 border border-zinc-50/10 rounded-md shadow-white/20 shadow-sm">
              <form className="max-w-lg">
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Channel name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Donut"
                    onChange={handleCreateChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    maxLength={200}
                    cols={20}
                    rows={3}
                    placeholder="(optional description)"
                    onChange={handleCreateChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    onClick={handleCreateSubmit}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create!
                  </button>
                  <button
                    type="button"
                    onClick={() => setcreate(false)}
                    className="text-white  bg-red-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:hover:bg-red-500 dark:focus:ring-blue-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          <h2 className="font-medium flex items-center border-b border-zinc-50/20 py-3 gap-3 text-md p-1 mx-3">
            <span>
              <AiOutlineStar size={30} />
            </span>{" "}
            Top 3 Channels saved
          </h2>{" "}
          <div className="p-2 flex flex-col gap-1.5">
            {popular?.map((item) => (
              <div key={item.channel_id} className="relative ">
                <div className="relative flex w-full  hover:bg-zinc-300/10  items-center justify-bewtween  rounded-sm text-slate-100">
                  <p
                    className={`w-full ${
                      channelIn?.id === item.channel_id
                        ? "bg-zinc-800"
                        : "bg-transparent" ?? ""
                    }  font-normal  text-md flex justify-between items-center gap-2`}
                  >
                    <p>{item.channel_name}</p>
                    <p className="mr-3 flex items-center gap-1"><span><CiSaveDown1/></span>{item.quantity}</p>
                  </p>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() =>{
                        HandleAddChannel({
                          id: item.channel_id,
                          name: item.channel_name,
                          description:item.channel_description
                        })}
                      }
                      className="text-white px-2 h-8 w-20 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 border border-zinc-50 "
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )) ?? (
              <p className="relative flex w-full px-4 hover:bg-zinc-300/10  items-center justify-bewtween  rounded-sm text-slate-300">
                No Popular Channels has been found... <br />
                search or create One!
              </p>
            )}
          </div>
          <h2 className="font-medium flex items-center gap-3 text-md p-2 border-b border-zinc-50/20 mx-3 py-3">
            <span>
              <PiTelevisionSimpleLight size={30} />
            </span>{" "}
            Your saved Channels
          </h2>{" "}
          <div className=" h-72 overflow-y-scroll  custom-scrollbar">
            {allchannels?.map((item) => (
              <div key={item.channel_id} className="relative ">
                <div className="relative flex w-full px-1 hover:bg-zinc-300/10  items-center justify-bewtween  rounded-sm text-slate-100">
                  <p
                    onClick={() => HandleJoin(item)}
                    className={`w-full ${
                      channelIn?.id === item.channel_id
                        ? "bg-zinc-800"
                        : "bg-transparent" ?? ""
                    }  p-2  font-normal  text-md flex items-center gap-1.5`}
                  >
                    {item.channel_name}
                  </p>
                  <div className="flex gap-2 items-center">
                    <button
                      className="  border  h-8 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-3 py-1.5 text-center  border-red-500/50 text-red-500/80 hover:text-white hover:bg-red-600 focus:ring-red-900"
                      onClick={() => HandleRemove(item.save_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )) ?? (
              <p className="relative flex w-full px-4 hover:bg-zinc-300/10  items-center justify-bewtween  rounded-sm text-slate-300">
                No Channels saved has been found... <br />
                search or create One!
              </p>
            )}
          </div>
        </div>

        <div
          onClick={() => setinfo(!info)}
          className="absolute  bottom-8 w-full  bg-zinc-950/50 "
        >
          <div className=" w-full relative flex flex-col justify-between min-h-[1rem] shadow-2xl  p-1 min-w-[200px] ">
            {signedUser && signedUser.avatar && (
              <div className="w-full   h-20 ">
                <div className="flex justify-start gap-5 text-zinc-300 items-center  h-full w-full">
                  <img
                    src={signedUser.avatar}
                    className="w-10 h-10 min-w-[2.5rem] object-cover rounded-full "
                    alt="avatar"
                  />
                  <p className=" font-medium font-sans drop-shadow-sm ">
                    {signedUser.username}
                  </p>
                  <span>{!info?<BsChevronDown/>: <BsChevronUp/>}</span>
                </div>
              </div>
            )}
            {signedUser && signedUser.avatar && (
              <div
                className={`text-zinc-50 ${
                  info ? "hidden" : "flex"
                } h-[300px] border-1 flex flex-col justify-between p-2 rounded-lg border-zinc-300/10 bg-zinc-950/80 w-full  absolute top-[-300px] left-0 z-50 overflow-hidden`}
              >
                <div
                  className={`flex border  gap-3 rounded-lg relative border-zinc-300/20 overflow-hidden  `}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
