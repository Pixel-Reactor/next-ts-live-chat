import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useMyContext } from "../context/context";
import SideBar from "@/components/SideBar";
import Main from "@/components/Main";
import { useRouter } from "next/router";
import io from "socket.io-client";

export default function Home() {
  const router = useRouter();
  const { signedUser, socket, setSocket } = useMyContext();
  useEffect(() => {
    if (signedUser) {
      const socketConnection = io(`${process.env.NEXT_PUBLIC_API_URL}`);
      setSocket(socketConnection);
      console.log(socket);
    }
  }, [signedUser]);

  useEffect(() => {
    if (socket && signedUser) {
      socket.on("connect", () => {
        try {
          console.log("connected");

          socket.emit("id", signedUser.id);

          socket.on("error", (error: any) => {
            console.error("Error en la conexión de Socket.io:", error);
          });
        } catch (error) {
          console.log(error);
        }

        return () => {
          socket.emit("logout");
          socket.disconnect();
        };
      });
    }
  }, [socket]);

  useEffect(() => {
    if (!signedUser) {
      router.push("/");
    }
  }, [signedUser]);

  return (
    <main className="select-none flex-col overflow-hidden text-zinc-300 flex bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-zinc-900 min-h-screen h-screen ">
      <h1>DonutChat</h1>
      <div className="flex h-full">
        <SideBar />
        <Main />
      </div>
    </main>
  );
}
