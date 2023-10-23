import { useState, ChangeEvent, useEffect } from "react";
import { useMyContext } from "../context/context";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import {IoMdAlert} from 'react-icons/io'



export default function Home() {
  const JsonInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});
  const { signedUser, setSignedUser } = useMyContext();
  const [errmsg, seterrmsg] = useState<string>('')
  const router = useRouter();
  const [form, setform] = useState({
    email: "",
    pwd: "",
  });
  

  const HandleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setform({ ...form, [name]: value });
  };

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    try {
      const res = await JsonInstance.post("/login", form);
      const data = res.data;
      if(data.status === 200 && data.message === 'login'){
        seterrmsg('')
        setSignedUser({
          token: data.token,
          id: data.id,
          name:data.name,
          username:data.username,
          avatar:data.avatar,
          bio:data.bio,
          
        });
        router.push("/chat");
      }else{
        seterrmsg(data.message)
      }
     
    } catch (error) {
      
      console.log('error',error);
    }
  };
  useEffect(() => {
    setSignedUser(null)
  }, [])
  
  return (
    <main className="select-none bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-zinc-900 min-h-screen">
     {errmsg &&
     <div 
     onClick={()=>seterrmsg('')}
     className="w-full   z-50 fixed top-10 ">     
      <div className=" flex shadow-slate-50 shadow-sm m-auto p-6 justify-between  items-center z-50 w-96 h-14 bg-zinc-700/90 rounded-md text-white font-semibold">
      <IoMdAlert className='text-amber-400' size={30}/>
     <p>{errmsg}</p> 
     <AiOutlineClose size={20}/>
      </div>
      </div>}

      <div className="bg-[url('../svg/blurry.svg')] w-full min-h-screen bg-no-repeat bg-cover bg-center p-10 flex justify-center items-start">
        <div className="max-w-3xl">
          <h1 className="  w-full text-center  md:flex md:justify-center  m-auto drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)] bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]  from-orange-800 via-amber-100 to-orange-900 text-5xl font-bold  tracking-normal ">
            Welcome to 
            <span className="mx-auto md:mx-2 text-left flex justify-center">
              d
              <Image
                className="w-auto h-auto"
                src="/donut.png"
                width={45}
                height={45}
                alt="donut"
              />
              nutChat!
            </span>
          </h1>
          <div className="flex flex-col md:flex-row mt-10 ">
            <p className="text-slate-200 sm:mb-10 text-justify font-semibold  leading-7 max-w-2xl m-auto h-30 mx-6 mt-10 drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)] ">
             DonutChat is a casual live chat, to spend time chatting with everyone online.
             <br />

             The rules : 
             <br />
             - You can't add friends, to get in touch with someone, you have to be online!
             <br />
             - As soon as you start a conversation with someone, it will be saved.
             <br />
             - You can create a channel, and all of them are public.
             <br />
             - Every 2 weeks of inactivity of a channel will remove it 
             
            </p>
            <div className="mt-20 mx-auto sm:mt-0 min-w-[400px] w-[400px] relative ">
              <div className="absolute  w-full h-full bg-gradient-to-r from-transparent via-gray-700-500 to-zinc-950/70 rounded-md"></div>
             
              <img src="/Chatapp.png"  alt="chatpreview" className="w-full h-full rounded-md"/>
              </div>
          
          </div>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]  from-orange-800 via-amber-100 to-orange-900 mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={HandleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className=" block text-sm font-medium leading-6 text-zinc-50"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      
                      type="email"
                      autoComplete="email"
                      onChange={HandleChange}
                      required
                      className="p-2 block w-full rounded-md border-0 py-1.5 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6  text-zinc-50"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="pwd"
                      type="password"
                      autoComplete="current-password"
                      onChange={HandleChange}
                      required
                      className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className=" border-2 border-zinc-400 flex w-full justify-center rounded-md bg-indigo-900 px-3 my-1 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                  <div className="flex">
                    <span className="w-full h-0.5 border-b-2 mt-4 mb-4 flex justify-center" />
                    <p className="w-10 h-4 mx-4 text-zinc-50 flex justify-center items-center translate-y-[8px]">
                      {" "}
                      or{" "}
                    </p>
                    <span className="w-full h-0.5 border-b-2 mt-4 mb-4 flex justify-center" />
                  </div>

                  <div 
                  className=" flex  items-center justify-center" 
                  onClick={() => router.push("/signup")}
                  >
                    <div className="h-11 w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]">
                      <div className="flex h-full w-full items-center justify-center bg-gray-800 hover:bg-gray-700">
                        <button
                          type="button"
                          onClick={() => router.push("/signup")}
                          className="text-sm font-black text-white z-50"
                        >
                          Sign Up

                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
