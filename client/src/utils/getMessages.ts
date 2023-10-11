import axios from "axios";

export default async function getMessages(token: string, target: string) {
  try {
    if(!token) return;
    const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const res = await instance.post('/getmessages',{target:target});
  if(res.data.status === 200){
    return {status:200,data:res.data.info}
  }else{
    return {status:403,message:'failed',info:{}}
  }
  } catch (error) {
    return {status:403,message:'failed',info:{}}
  }
  
  
}
