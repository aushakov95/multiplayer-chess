import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import socketio from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const activeGames = {};
const users = {};

app.use("/todos", routes.todos);

const server = app.listen(9000, () =>
  console.log(`👂 Checkers server listening on port 9000`)
);

const io = socketio.listen(server);

io.on("connection", (socket) => {
  console.log(`✅ Player ${socket.id} connected`);

  socket.on("login", (userId) => {
    console.log(userId);

    if (!users[userId]) {
      users[userId] = { games: {} };
    }
  });

  socket.on("move", (msg) => {
    console.log(`move to game ${msg.gameInfo.id}`);

    const gameId = msg.gameInfo.id;
    activeGames[gameId].board = msg.board;
    socket.to(gameId).emit("move", msg.move);
  });

  socket.on("createGame", (msg) => {
    const { gameId, userId } = msg;
    socket.join(gameId);
    activeGames[gameId] = {
      id: gameId,
      board: "start",
      players: {},
    };
    activeGames[gameId].players[userId] = "white";
  });

  socket.on("joinGame", (msg) => {
    console.log(`Active games: ${JSON.stringify(activeGames)}`);
    const { gameId, userId } = msg;
    if (activeGames.hasOwnProperty(gameId)) {
      const game = activeGames[gameId];
      socket.join(gameId);

      //Check if this user has joined this game before
      if (!game.players.hasOwnProperty(userId)) {
        game.players[userId] = "black";
      }

      io.in(gameId).emit("startGame", game);
    } else {
      console.log(socket.id);
      io.to(socket.id).emit(
        "joinError",
        "No such game exists or has already ended"
      );
    }
  });

  socket.on("resignFromTheGame", (gameInfo) => {
    const gameId = gameInfo.id;
    console.log(`Ending game ${gameId}`);
    io.in(gameId).emit("endGame");
    delete activeGames[gameId];
    console.log(`Game ${gameId} ended`);
  });

  socket.on("disconnect", () => {
    console.log(`🎮 🚫Player disconnected`);
  });
});
