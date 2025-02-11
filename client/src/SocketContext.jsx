import { createContext, useContext, useEffect, useState } from "react"
import {io} from "socket.io-client"
import { useAuth } from "./authContext"
import { BASE_URL } from "./helper";
const SocketContext = createContext();

export const SocketContextProvider = ({children})=>{

    const [socket , setSocket] = useState(null)
    const [onlineUser, setOnlineUser] = useState([])

    const {userdata} = useAuth()

    useEffect(()=>{
        if(userdata){
            const socket = io(`${BASE_URL}`,{
                query:{
                    userId:userdata?._id,
                }
            })
            socket.on("getOnlineUsers",(users)=>{
                setOnlineUser(users)
            })
            setSocket(socket)
            return()=> socket.close()
        }
        else{
            if(socket){
                socket.close();
                setSocket(null)
            }
        }
    },[userdata])
return(
    <SocketContext.Provider value={{socket,onlineUser}}>
        {children}
    </SocketContext.Provider>
)
    
}

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketContext.Provider");
  }
  return context;
};