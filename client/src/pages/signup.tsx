import React, { useState, DragEvent, useRef, useEffect } from "react";
import { BiSolidUserCircle, BiErrorCircle } from "react-icons/bi";
import { MdInsertPhoto } from "react-icons/md";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { GoAlert } from "react-icons/go";
import axios from 'axios'


import Image from "next/image";

interface Form {
  username: string;
  bio: string;
  name: string;
  email: string;
  city: string;
  [key: string]: string;
}
interface FormErr {
  username: boolean | null;
  pwd: boolean | null;
  email: boolean | null;
}

export default function Home() {
 
  const FormInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  const JsonInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    }
  });
  const [DragActive, setDragActive] = useState<boolean>();
  const [loading, setloading] = useState<boolean>(false);
  const [file, setfile] = useState<File | null>();
  const [fileErr, setfileErr] = useState<string>("");
  const [errormessage, setErrormessage] = useState<string>("")
  
  const [form, setform] = useState<Form>({
    username: "",
    bio: "",
    name: "",
    email: "",
    city: "",
  });
  const [formerr, setformerr] = useState<FormErr>({
    username: null,
    pwd: null,
    email: null,
  });
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const type = e.dataTransfer.files[0].type.slice(-3);
     
      if (
        type === "png" ||
        type === "jpg" ||
        type === "gif" ||
        type === "peg"
      ) {
        setfile(e.dataTransfer.files[0]);
        setfileErr("");
      } else {
        setfileErr("Not allowed file extention");
      }
    }
  };
  const handleUpButton = (e: any) => {
    e.preventDefault();
    const type = e.target.files[0].type.slice(-3);

    if (type === "png" || type === "jpg" || type === "gif" || type === "peg") {
      setfile(e.target.files[0]);
      setfileErr("");
    } else {
      setfileErr("Not allowed file extention");
    }
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    setform({
      ...form,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const HandleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (file) {
        formData.append("avatar", file);
      }
      for (const key in form) {
        formData.append(key, form[key]);
      }
      setloading(true);
      const response =await  FormInstance.post('/signup',formData)
      const data =response.data;
      setloading(false);
      if (data.status === 200) {
        console.log("todo bien!");

      } else if(data.field === 'avatar'){
        setfileErr(data.message)
        
      }else{
        setErrormessage(data.message)
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const CheckUsername = async () => {
      try {
        if (form.username.length > 2) {
          setloading(true);
          const res= await JsonInstance.post('/check/username',{username:form.username})
     
          const data = res.data;
          console.log(data)
          setloading(false);

          if (data.ok) {
            setformerr({ ...formerr, username: false });
          } else {
            setformerr({ ...formerr, username: true });
          }
          
        }
      } catch (error) {
        setformerr({ ...formerr, username: true });
      }
    };
    CheckUsername();
  }, [form.username]);
  useEffect(() => {
    const CheckEmail = async () => {
      try {
        if (form.email.length > 5 && !loading) {
          setloading(true);

          const res= await JsonInstance.post('/check/email',{email:form.email})
     
          const data = res.data;
          setloading(false);
          if (data.ok) {
            setformerr({ ...formerr, email: false });
          } else {
            setformerr({ ...formerr, email: true });
          }
         
        }
      } catch (error) {
        setformerr({ ...formerr, email: true });
      }
    };
    CheckEmail();
  }, [form.email]);

  return (
    <main className=" bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-zinc-900 min-h-screen flex flex-col items-center justify-center">
       <div className="bg-[url('../svg/blurry.svg')] w-full min-h-screen bg-no-repeat bg-cover bg-center p-10 flex flex-col justify-center items-center">
      <div className="my-5 mb-10 drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)] bg-clip-text text-transparent bg-[conic-gradient(at_top,_var(--tw-gradient-stops))]  from-orange-800 via-amber-100 to-orange-900 text-5xl font-extrabold  tracking-normal w-full text-center">
        {" "}
        <span className="mx-auto text-center flex justify-center">
          D<Image src="/donut.png" width={50} height={50} alt="donut" />
          nutChat
        </span>
      </div>
      <div className="max-w-lg backdrop-blur-[13px] bg-sky-600/3 w-full p-4 rounded-md border border-zinc-50/40 backdrop-saturate-150 ">
        <form onSubmit={HandleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-zinc-50/90 pb-12">
              <h2 className="text-base font-semibold leading-7 text-zinc-50">
                Profile
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-zinc-50"
                  >
                    Username
                  </label>
                  <div className="mt-2 flex">
                    <div className="flex p-1  rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        autoComplete="username"
                        required
                        className="block flex-1 border-0 bg-transparent  py-1.5 pl-1 text-orange-200 placeholder:text-gray-200/80 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="ex. AmazingDonut"
                      />
                    </div>
                    {formerr.username == false && form.username.length > 2 ? (
                      <div className="text-zinc-50 flex items-center justify-center ml-1">
                        <AiOutlineCheck />
                        <span className="text-green-600 font-semibold ml-1">
                          Available
                        </span>
                      </div>
                    ) : (
                      <div className="text-zinc-50 flex items-center justify-center ml-1">
                        <AiOutlineClose />
                        <span className="text-red-600/80 font-semibold ml-1">
                          {!form.username.length? 'Choose an Username':'Not Available'} 
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-zinc-50"
                  >
                    Password
                  </label>
                  <div className="mt-2 ">
                    <div className="flex p-1  rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="password"
                        name="pwd"
                        min={8}
                        required
                        onChange={handleChange}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-orange-200 placeholder:text-gray-200 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-zinc-50"
                  >
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="bio"
                      onChange={handleChange}
                      rows={3}
                      className="block w-full p-3 bg-transparent rounded-md border-0 py-1.5 text-orange-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write a few sentences about yourself.
                  </p>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-zinc-50"
                  >
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="photo-upload"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <BiSolidUserCircle
                        className="h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                    )}
                    {file && (
                      <button
                        type="button"
                        onClick={() => {setfile(null);setfileErr('')}}
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>
                {!file && (
                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-zinc-50"
                    >
                      Cover photo
                    </label>
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`mt-2 flex justify-center rounded-lg ${
                        DragActive ? "bg-slate-800" : "bg-transparent"
                      } border border-dashed border-zinc-50/25 px-6 py-10`}
                    >
                      <div className="text-center">
                        <MdInsertPhoto
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className={`relative cursor-pointer rounded-md bg-white px-1 py-0.5 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500`}
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              onChange={handleUpButton}
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`${
                  fileErr ? "flex" : "hidden"
                } w-full rounded-sm mt-5 border text-sm border-orange-400/50 h-10 text-zinc-50 font-semibold flex items-center justify-center`}
              >
                <span className="mr-2">
                  <BiErrorCircle />
                </span>
                <p>{fileErr}</p>
              </div>
            </div>

            <div className="border-b border-zinc-50/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-zinc-50">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-50">
                Use a permanent address where you can receive mail.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-zinc-50"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      onChange={handleChange}
                      required
                      className="block w-full bg-transparent p-2 rounded-md border-0 py-1.5 text-orange-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-zinc-50"
                  >
                    Email address
                  </label>
                  <div className="mt-2 flex ">
                    <input
                      id="email"
                      name="email"
                      onChange={handleChange}
                      type="email"
                      autoComplete="false"
                      required
                      className="block w-full bg-transparent p-2 rounded-md border-0 py-1.5 text-orange-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />{" "}
                    {formerr.email == false && form.email.length > 5 ? (
                      <div className="text-zinc-50 flex items-center justify-center ml-1 ">
                        <AiOutlineCheck />
                        <span className="text-green-600 font-semibold ml-1">
                          Available
                        </span>
                      </div>
                    ) : (
                      <div className="text-zinc-50 flex items-center justify-center ml-1">
                        <AiOutlineClose className="text-red-600/80" />
                        <span className="text-red-600/80 font-semibold min-w-[130px] ml-1 ">
                        {!form.email.length? 'Type your email':'Not Available'} 
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-zinc-50"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      autoComplete="false"
                      onChange={handleChange}
                      className="block w-full bg-transparent p-2 rounded-md border-0 py-1.5 text-orange-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              {errormessage &&
                <div

                className="my-auto mx-auto mt-8  flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                role="alert"
              >
                <div className="inline-flex items-center justify-center min-w-8 w-8 h-8 text-orange-500/70 bg-orange-100 rounded-full dark:bg-orange-700 dark:text-orange-200">
                <GoAlert/>
                </div>
                <div className="ml-3 text-sm font-normal">
               {errormessage}
                </div>
                <button
                  type="button"
                  className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  onClick={()=>setErrormessage('')}
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <AiOutlineClose/>
                </button>
              </div>}
            
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      </div>
    </main>
  );
}
