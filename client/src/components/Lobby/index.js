import React from "react";
import JoinGame from "../JoinGame";
import CreateGame from "../CreateGame";
import "./lobby.css";

const Lobby = () => {
  return (
    <div className="lobby">
      <h2 className="title">Multiplayer Chess &#9823;</h2>
      <div className="game-menu">
        <CreateGame />
        <JoinGame />
      </div>
    </div>
  );
};

export default Lobby;
