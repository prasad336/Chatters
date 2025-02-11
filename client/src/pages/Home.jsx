import { useEffect, useState } from "react"
import "../css/home.css"
import Chat from "./Chat";

const Home = () => {
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth <= 700);

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSmall(window.innerWidth <= 700);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            {!isScreenSmall && <Chat />}
        </>
    );
};

export default Home