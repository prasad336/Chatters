import "../css/chat.css";
import { BASE_URL } from "../helper";
import { useAuth } from "../authContext";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../SocketContext";
import tone from "../music/tone.mp3";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const { messages, nam, usernam, recieverId, token, userdata, loading, setMessage } = useAuth();
    const { socket } = useSocketContext();
    const lastMessageRef = useRef();
    const inputRef = useRef();
    const navigate = useNavigate()
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    const [input, setInput] = useState("");

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const sound = new Audio(tone);
            sound.play();
            setMessage((prevMessages) => [...prevMessages, newMessage]);
        });
        return () => socket?.off("newMessage");
    }, [socket]);

    const sendMessage = async (e, id) => {
        e.preventDefault();
        const newMessage = {
            message: input,
            senderId: userdata._id,
            receiverId: recieverId,
            createdAt: new Date().toISOString(),
        };

        setMessage((prevMessages) => [...prevMessages, newMessage]);
        try {
            const response = await fetch(`${BASE_URL}/api/message/send/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: input }),
            });
            if (response.ok) {
                await response.json();
                setInput("");
                inputRef.current?.focus();
            }
        } catch (error) {
            console.log("send Message error", error);
        }
    };

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    };

    const message = (mess) => {
        const time = mess.createdAt ? formatTime(mess.createdAt) : "";
        return (
            <div ref={lastMessageRef} className={userdata._id === mess.senderId ? "sender" : "reciever"}>
                <div className={userdata._id === mess.senderId ? "message" : "message2"}>
                    <p>{mess.message}</p>
                    <p>{time}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="chat">
            {nam && usernam ? (<>
                <div className="chatHead">

                    <div className="chatDetails">
                        <i onClick={() => navigate(-1)} className="fa-solid fa-arrow-left"></i>



                        <div className="chatProfile">

                            <img
                                src='https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg'
                                alt=""
                            />
                        </div>
                        <div className="chatName">
                            <h3>{nam}</h3>
                            <p>{usernam}</p>
                        </div>


                    </div>

                    <div className="call">
                        <i className="fa-solid fa-phone"></i>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                </div></>) : ""
            }
            <div className="chatBox">
                {loading ? (
                    <div className="loader"></div>
                ) : (
                    <>
                        {Array.isArray(messages) && messages.length > 0 ? (
                            messages.map(message)
                        ) : (
                            <div className="noMessage">
                                <div className="container">
                                    <div className="icon">
                                        <i className="fa-brands fa-rocketchat"></i>
                                    </div>
                                    <h1>Start the Conversation</h1>
                                    <p>It’s quiet here! Break the silence by sending the first message.</p>
                                    <button>Send a Message</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="sendMessage">
                <form action="" onSubmit={(e) => sendMessage(e, recieverId)}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdAX8dzx43v-JGJuh_HLH8cEyFEAX0MQUflZGbchzSFicjECoH7Y6OolpPk1Q4EIzXb84&usqp=CAU" alt="" />
                    <input
                        type="text"
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button type="submit" >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
