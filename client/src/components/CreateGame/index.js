import React, { useContext } from "react";
import { SocketContext } from "../Socket";
import GameContext from "../Game";
import { Button } from "antd";
import "./create.css";

const CreateGame = () => {
  const socket = useContext(SocketContext);
  const { gameInfo, setGameInfo } = useContext(GameContext);

  //const [gameId, setGameId] = useState("");

  const randomString = () => {
    const length = 6;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  };

  const createGame = () => {
    const gameId = randomString();

    socket.emit("createGame", {
      gameId,
      userId: localStorage.getItem("userId"),
    });
    setGameInfo({ ...gameInfo, id: gameId, playerColor: "white" });
  };

  if (gameInfo.id.length > 0) {
    return <p>Share this code with your friend: {gameInfo.id}</p>;
  }

  return (
    <Button
      type="primary"
      onClick={createGame}
      size="large"
      block
      id="create-button"
    >
      Create Game
    </Button>
  );
};

export default CreateGame;
