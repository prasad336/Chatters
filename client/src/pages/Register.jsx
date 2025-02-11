import { useState } from "react";
import { useAuth } from "../authContext";
import { BASE_URL } from "../helper";
import "../css/register.css";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { setToken, setIsLoggin, loginLoader, setLoginLoader } = useAuth();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        
    });

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginLoader(true);

        // if (!input.image) {
        //     Toastify({
        //         text: 'Please select a profile image',
        //         duration: 3000,
        //         gravity: 'top',
        //         position: 'right',
        //         className: 'custom-toast',
        //     }).showToast();
        //     setLoginLoader(false);
        //     return;
        // }

       

        try {
            const response = await fetch(`${BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify(input)
            });

            if (response.ok) {
                const res_data = await response.json();
                localStorage.setItem("token", res_data.token);
                setToken(res_data.token);
                setIsLoggin(true);
                setLoginLoader(false);
                navigate('/');
                window.location.reload();
                Toastify({
                    text: 'Welcome! Your registration is complete',
                    duration: 3000,
                    close: true,
                    gravity: 'top',
                    position: 'right',
                    className: 'custom-toast'
                }).showToast();
            }
        } catch (error) {
            console.log('Register error:', error);
            setLoginLoader(false);
        }
    };

    return (
        <div className="registerPage">
            <div className="register">
            <div className="registerImg">
                    Chatters
                </div>
                <form onSubmit={handleSubmit}>
                   
                    <div>
                        <input type="text" name="name" placeholder="Enter your Full name" onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="text" name="username" placeholder="Enter your Username" onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="email" name="email" placeholder="Enter your Email" onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="Enter your Password" onChange={handleChange} required />
                    </div>
                    <div>
                        <button type="submit">{loginLoader ? <div className="loader"></div> : "Sign Up"}</button>
                    </div>
                </form>
                <div className="or">Or</div>
                <div className="google">Sign Up with Google</div>
                <div className="dont">Already have an account? <span onClick={() => navigate('/login')}>Login</span></div>
            </div>
        </div>
    );
};

export default Register;
