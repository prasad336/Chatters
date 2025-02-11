import { AuthProvider } from "../authContext";
import { SocketContextProvider } from "../SocketContext";

const ParentProvider = ({ children }) => {
  return (
    <SocketContextProvider>
      <AuthProvider>{children}</AuthProvider>
    </SocketContextProvider>
  );
};

export default ParentProvider;