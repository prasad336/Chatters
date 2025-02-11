import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "./helper"

export const authContext = createContext()

export const AuthProvider = ({ children }) => {
    

    const [token , setToken ] = useState(localStorage.getItem("token")) 
    const [isloggin, setIsLoggin] = useState(() => !!localStorage.getItem("token"));
    const [loading , setLoading]= useState(false)
    const [loading2, setLoading2] = useState(true)
    const [loginLoader , setLoginLoader] = useState(false)
    const [userdata , setUserdata] = useState("")
    const [messages,setMessage] = useState([])
    const [recieverId,setRecieverId]= useState("")
    const [nam , setName] = useState("")
    const [usernam, setUsernam] = useState("")
    
    const userData = async()=>{
        const response = await fetch(`${BASE_URL}/api/auth/userdata`,{
            method:"GET",
            headers:{
                "Content-Type":"Application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        if(response.ok){
            const res_data = await response.json()
            setUserdata(res_data.userData)
        }
    }

    
    useEffect(()=>{
        if(isloggin){
            userData()
        }
    },[isloggin])


    const getMessages = async (id) => {
        setLoading(true); 
        try {
            const response = await fetch(`${BASE_URL}/api/message/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const mes_data = await response.json();
    
            if (mes_data.msg && mes_data.msg.length > 0) {
                setMessage(mes_data.msg); // Set messages if they exist
            } else {
                setMessage([]); // Set an empty array if no messages
            }
    
        } catch (error) {
            console.log("getMessage error", error);
            setMessage([]); // Ensure message state is updated, even on error
        } finally {
            setLoading(false); // Always stop loading
        }
    };
    
    
    const name2 = (name,username,reciever) =>{
        setName(name)
        setUsernam(username)
        setRecieverId(reciever)
        
    }
    return (
        <authContext.Provider value={{loading,loading2,setLoading2,loginLoader,setLoginLoader,isloggin,setIsLoggin,userdata,token,setToken , userData,getMessages,messages,setMessage,name2 , nam, usernam,recieverId}}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => {
    const useauthContext = useContext(authContext)
    if (!useauthContext) {
        throw new Error("useAuth error")

    }
    return useauthContext;
}