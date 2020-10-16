import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../Socket";
import GameContext from "../Game";
import { Button, Input, Row, Col } from "antd";
import "./join.css";

const JoinGame = () => {
  const socket = useContext(SocketContext);
  const [gameId, setGameId] = useState("");
  const { gameInfo, setGameInfo } = useContext(GameContext);

  useEffect(() => {
    socket.on("joinError", (msg) => {
      alert(msg);
      setGameInfo({ ...gameInfo, id: "" });
    });
  }, []);

  const joinGame = () => {
    socket.emit("joinGame", {
      gameId,
      userId: localStorage.getItem("userId"),
    });
    setGameInfo({ ...gameInfo, id: gameId });
  };

  return (
    <div className="join">
      <Row>
        <Col span={14}>
          <Input
            placeholder="Code"
            onChange={(event) => {
              setGameId(event.target.value.toUpperCase());
            }}
            value={gameId}
            size="large"
            className="join-input"
            maxlength="6"
          />
        </Col>
        <Col span={10}>
          <Button
            type="primary"
            size="large"
            onClick={joinGame}
            id="join-button"
          >
            Join Game
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default JoinGame;
