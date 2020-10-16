import io from "socket.io-client";

const Socket = () => {
  return io("http://10.0.1.19:9000");
};

export default Socket;
