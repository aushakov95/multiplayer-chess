import React, { useState, useContext, useEffect } from "react";
import { SocketContext } from "../Socket";
import GameContext from "../Game";
import { Button, Input, Row, Col } from "antd";
import "./join.css";

const JoinGame = () => {
  const socket = useContext(SocketContext);
  const [gameId, setGameId] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { gameInfo, setGameInfo } = useContext(GameContext);

  useEffect(() => {
    setLoading(false);
    socket.on("joinError", (msg) => {
      alert(msg);
      setGameInfo({ ...gameInfo, id: "" });
      setLoading(false);
    });
  }, []);

  const joinGame = () => {
    setLoading(true);
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
            loading={isLoading}
          >
            Join Game
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default JoinGame;
