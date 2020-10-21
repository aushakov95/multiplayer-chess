import io from "socket.io-client";

const Socket = () => {
  return io(process.env.REACT_APP_SERVER_URL);
};

export default Socket;
