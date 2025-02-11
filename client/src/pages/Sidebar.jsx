import { useNavigate } from "react-router-dom"
import "../css/sidebar.css"
import { BASE_URL } from "../helper.js"
import { useEffect, useState } from "react"
import { useAuth } from "../authContext.jsx"
const Sidebar = () => {

    const navigate = useNavigate()
    const navi = () => {
        if (window.location.pathname === "/chat") {
            return;
        }
        if (window.location.pathname === "/") {
            return navigate("/chat");
        }
    };
    const [searchUsers, setSearchUser] = useState("")

    const [chatUsers, setChatUser] = useState([])
    console.log(chatUsers)

    const { token, isloggin, getMessages, name2, loading2, setLoading2 ,setIsLoggin } = useAuth()

    const [input, setInput] = useState("")

    const handleChange = (e) => {
        setInput(e.target.value)
    }
    const logout = () => {
        localStorage.removeItem("token")
        setIsLoggin(false)
        navigate("/register")
        
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${BASE_URL}/api/user/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "user": input })
            })
            const searchUser = await response.json()
            setSearchUser(searchUser.user)
           
        } catch (error) {
            console.log("search error", error)
        }
    }
    const handleSubmit2 = async () => {
        setLoading2(true)

        const response = await fetch(`${BASE_URL}/api/user/myusers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (response.ok) {
            const myuser = await response.json()
            setChatUser(myuser)
            setLoading2(false)
        }


    }
    useEffect(() => {
        if (isloggin) {
            handleSubmit2()
        }
    }, [isloggin])

    const handleGetMessage = (id, name, username) => {
        getMessages(id)
        name2(name, username, id)
        navi()
    }


    const chatUser = (user) => {

        return (<>
            <div className="user" key={user._id} onClick={() => handleGetMessage(user._id, user.name, user.username )}>
                <div className="profile">
                    <img src="https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg"  alt="" />

                </div>
                <div className="name">
                    <h3>{user ? user.name : ""}</h3>
                    <p>{user ? user.username : ""}</p>
                </div>
            </div>
            

        </>)
    }


    return (<>
        <div className="sidebar">
            <div className="sideHead">
                <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdAX8dzx43v-JGJuh_HLH8cEyFEAX0MQUflZGbchzSFicjECoH7Y6OolpPk1Q4EIzXb84&usqp=CAU" alt="" />Chatters</div>
                <div><i onClick={logout} className="fa-solid fa-arrow-right-from-bracket"></i></div>
            </div>
            <form className="search" onSubmit={handleSubmit}>
                <input type="text" name="" id="" placeholder="find users.." onChange={handleChange} />
                <button><i className="fa-solid fa-magnifying-glass"></i></button>
            </form>

            <div className="users">
                {
                    searchUsers ? <><div className="user" onClick={() => handleGetMessage(searchUsers._id, searchUsers.name, searchUsers.username)} >
                        <div className="profile" >
                            <img src={searchUsers.profile} alt="" />

                        </div>
                        <div className="name">
                            <h3>{searchUsers ? searchUsers.name : "roshan"}</h3>
                            <p>{searchUsers ? searchUsers.username : "roshan12"}</p>
                        </div>
                    </div></> : ""
                }

                {
                    loading2 ?
                        <><div className="loader"></div></>
                        :
                        <>{Array.isArray(chatUsers) && chatUsers.length > 0 ? chatUsers.map(chatUser)
                            :
                            <> {!searchUsers ? (
                                <div className="noUsersPage">
                                    <div className="noUsersContainer">
                                        <div className="icon"><i className="fa-solid fa-user-slash"></i></div>
                                        <h1>No Users Found</h1>
                                        <p>It seems quiet here. Please search for users to begin!</p>
                                        <button>Search Users</button>
                                    </div>
                                </div>
                            )
                                :
                                null}</>}
                        </>


                }





            </div>

        </div>
    </>)
}

export default Sidebar 