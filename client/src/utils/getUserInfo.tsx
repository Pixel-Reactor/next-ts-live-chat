import axios from "axios";

export default async function getUserInfo(token: string, target: string) {
  try {
    if(!token) return;
    const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
 
  const res = await instance.post('/userinfo',{target:target});
  console.log(res)
  if(res.data.status === 200){
    return {ok:true,data:res.data.info}
  }else{
    return {ok:false,message:'failed'}
  }
  } catch (error) {
    return {ok:false,message:'failed'}
  }
  
  
}
