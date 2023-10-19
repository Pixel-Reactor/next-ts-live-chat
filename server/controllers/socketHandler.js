import { io } from "../index.js";
import { socketUser } from "./socketUser.js";
import DBconn from "../db.js";
import { GetChannelInfo } from "./GetChannelInfo.js";
import { GetChannelsList } from "./GetChannelsList.js";
import { GetPopular } from "./GetPopulars.js";
import { v4 as uuidv4 } from "uuid";

let connectedUsers = [];

export const getConnectedUsers = () => {
  return connectedUsers;
};

export const SocketHandler = async () => {
  const connection = await DBconn();
  try {

    io.on("connection", (socket) => {
      console.log("a user connected")

      socket.on("id", async (id) => {

        socket.UserId = id
        socket.channel = null
        const userInfo = { info: await socketUser(id), socketId: socket.id, channel: null }
        const channelinfo = await GetChannelInfo(id.channel)


        function buscarObjetoPorId(arr, id) {
          return arr.find((obj) => obj.info.id === id);
        }
        const find = buscarObjetoPorId(connectedUsers, id);


        if (find === undefined) {
          connectedUsers.push(userInfo);
        }


        io.emit("users", {
          connected: connectedUsers,
        }); 
        const list = await GetChannelsList(socket.UserId);
        io.emit("savedchannels", list)
        io.emit("channelinfo", channelinfo)
      });
        GetPopular()
        
        socket.on("sendmessage", async (message) => {
        const userInfo = await socketUser(message.from);
        const messageId = uuidv4();
        if (!userInfo.id || !message.channel) return;
        const save = await connection.query(`INSERT INTO messages(id,sender,recipient,text) VALUES(?,?,?,?);`, [messageId, userInfo.id, message.channel.channel_id, message.message.text])

        if (save[0].affectedRows > 0) {
          const date = new Date();

          io.emit("newmessage", { sender: userInfo, text: message.message.text, date: date, id: messageId, channel: message.channel.channel_id });


        } else {
          io.emit("newmessage", { sender: userInfo, text: " An error occurred retrieving this message ", date: date })
        }
      });
      socket.on('changechannel', (room) => {

        connectedUsers = connectedUsers.map(connected => {
          if (connected.info.id === socket.UserId) {
            return { ...connected, channel: room }
          }
          return connected;
        })
    

        io.emit('users', { connected: connectedUsers })

      })
      socket.on("logout", () => {
        connectedUsers = connectedUsers.filter(user => user.info.id !== socket.UserId);
        socket.disconnect();
        console.log("user logged out")
      });
      socket.on("disconnect", () => {
        console.log("disconnected")
        connectedUsers = connectedUsers.filter(user => user.info.id !== socket.UserId);
        io.emit("users", {
          connected: connectedUsers
        });
      });
    });
  } catch (error) {
    console.log('error', error)
  } finally {
    connection.release()
  }

}
