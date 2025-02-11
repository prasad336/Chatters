import { useState } from "react"
import { BASE_URL } from "../helper"
import { useAuth } from "../authContext"
import "../css/login.css"
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useNavigate } from "react-router-dom"
const Login = () => {
    const { setToken ,setIsLoggin,setLoginLoader,loginLoader} = useAuth()
    const navigate = useNavigate()
    const [input, setInput] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setInput({ ...input, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoginLoader(true)
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify(input)
            })
            if (response.ok) {
                const res_data = await response.json()
                setToken(localStorage.setItem("token", res_data.token))
                setIsLoggin(true)
                setLoginLoader(false)
                navigate("/")
                window.location.reload();
                Toastify({
                    text: 'You have logged in successfully',
                    duration: 3000,
                    close: true,
                    gravity: 'top',
                    position: 'right',
                    className: 'custom-toast'
                }).showToast();
                

            }
        } catch (error) {
            console.log('login error', error)
        }
    }
    return (<>

        <div className="loginPage">
            <div className="login">
                <div className="loginImg">
                    Chatters
                </div>

                <form action="" onSubmit={handleSubmit}>

                    <div>

                        <input type="email" name="email" id="email" placeholder="Enter your Email" onFocus={()=>setLoginLoader(false)} onChange={handleChange} required />
                    </div>
                    <div>

                        <input type="password" name="password" id="password" placeholder="Enter your Password" onFocus={()=>setLoginLoader(false)} onChange={handleChange} required/>
                    </div>
                    <div>
                        <button type="submit">{loginLoader ? <div className="loader"></div> :"Sign In"}</button>
                    </div>
                </form>
                <div className="or">
                    Or 
                </div>
                <div className="google">
                    Sign in with Google
                </div>
                <div className="dont">Don't have an Account?  <span onClick={() => navigate("/register")}>Sign Up</span></div>
            </div>
        </div>
    </>)
}
export default Login