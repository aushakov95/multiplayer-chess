import React, { useState, useEffect, useContext } from "react";
import Chessboard from "chessboardjsx";
import Chess from "chess.js";
import { SocketContext } from "../Socket";
import GameContext from "../Game";
import { Button, Popconfirm } from "antd";
import "./board.css";

let game = null;

const Board = () => {
  const socket = useContext(SocketContext);
  const { gameInfo, setGameInfo, setGameStarted } = useContext(GameContext);

  const [position, setPosition] = useState(gameInfo.board);
  const [notification, setNotification] = useState("");

  const getTurn = () => {
    let turn = game.turn();

    switch (turn) {
      case "w":
        turn = "white";
        break;
      case "b":
        turn = "black";
        break;
      default:
        turn = "white";
    }
    return turn;
  };

  useEffect(() => {
    if (gameInfo.board === "start") {
      game = new Chess();
    } else {
      game = new Chess(gameInfo.board);
    }

    const turn = getTurn();
    if (turn === gameInfo.playerColor) {
      setNotification("It's your turn");
    } else {
      setNotification("It's your opponent's turn");
    }

    socket.on("move", (msg) => {
      game.move(msg);
      setPosition(game.fen());
      setNotification("It's your turn");
    });
  }, []);

  useEffect(() => {
    if (game.game_over()) setNotification("Game over!");
  });

  const onDrag = ({ piece }) => {
    const turn = getTurn();
    if (
      turn !== gameInfo.playerColor ||
      piece[0] !== gameInfo.playerColor[0] ||
      game.game_over() === true
    ) {
      return false;
    }
    return true;
  };

  const onDrop = ({ piece, sourceSquare, targetSquare }) => {
    // Check if the move is legal
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    // Illegal move
    if (move === null) return;

    socket.emit("move", { move, gameInfo, board: game.fen() });
    setPosition(game.fen());
    setNotification("It's your opponent's turn");
  };

  const calculateBoardWidth = ({ screenWidth }) => {
    const maxWidth = 500;
    console.log(`screenWidth: ${screenWidth}`);
    if (screenWidth * 0.75 > maxWidth) {
      return 500;
    }
    return screenWidth * 0.9;
  };

  const resignFromTheGame = () => {
    socket.emit("resignFromTheGame", gameInfo);
  };

  return (
    <div className="chessboard-container">
      <h3 className="notification">{notification}</h3>
      <p>You play the {gameInfo.playerColor} pieces</p>
      <div>
        <Popconfirm
          title="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={resignFromTheGame}
        >
          <Button danger className="resign-button">
            Resign
          </Button>
        </Popconfirm>
        <Chessboard
          onDrop={onDrop}
          allowDrag={onDrag}
          position={position}
          orientation={gameInfo.playerColor}
          className="chessboard"
          calcWidth={calculateBoardWidth}
          darkSquareStyle={{ backgroundColor: "#855E42" }}
          lightSquareStyle={{ backgroundColor: "#f7f7f7" }}
        />
      </div>
    </div>
  );
};

export default Board;
